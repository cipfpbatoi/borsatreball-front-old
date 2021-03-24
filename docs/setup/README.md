# Configurar el servidor

## Desplegament per a desenvolupament
Si la nostra màquina és per a desenvolupar l'aplicació el més senzill és crear un entorn amb Vagrant i **Homestead**. En la [documentació de Laravel](https://laravel.com/docs/8.x/homestead) hi ha informació de còm crear i configurar eixe entorn.

### Descàrrega de l'aplicació del backend
A l'hora de descarregar el codi, des de la carpeta `~/code` inicialitzem git i descarregem l'aplicació:
```bash
git clone https://github.com/cipfpbatoi/borsatreball-api.git
```

## Desplegament per a producció del backend
Si només volem tindre l'aplicació funcionant necessitem un servidor on instal·larem:
* **apache2**
* **mysql-server** o **mariadb-server**
* **php**
* **phpmyadmin**
* **git**
* **composer**

Per a configurar el servidor de bases de dades hem d'executar el comando **`mysql_secure_installation`**. 

NOTA: ara la validació dels usuaris la fa el sistema (el _plugin_ 'auth_socket' o 'unix_socket'). Per a configurar un usuari amb privilegis el que hem de fer és:
```bash
mysql_secure_installation
sudo mysql -u root

mysql> CREATE USER nomusuari@localhost IDENTIFIED BY 'P@ssw0rd';
# SI volem vore-ho
mysql> SELECT User, Host, plugin, authentication_string FROM mysql.user;
# Creem la base de dades
mysql> CREATE DATABASE borsatreball;
# i li donem privilegis a l'usuari
mysql> GRANT ALL PRIVILEGES ON borsatreball.* TO nomusuari@localhost;
mysql> exit;
```

### Configurar apache
Creem els certificats (el _.key_ en /etc/ssl/private i els altres 2 en en /etc/ssl/certs):
```bash
openssl genrsa -out borsa.key 2048
openssl req -new -key ../private/borsa.key -out borsa.csr   # completem la informació que ens demanen
openssl x509 -req -in borsa.csr -signkey ../private/borsa.key -out borsa.crt
```

Configurem el lloc web SSL en _/etc/apache2/sites-available_:
* ServerName: p.ej. `ServerName borsa.my`
* DocumentRoot: `DocumentRoot /var/www/html/borsaBatoi/public`
* SSLCertificateFile: `SSLCertificateFile /etc/ssl/certs/borsa.crt`
* SSLCertificateKeyFile: `SSLCertificateKeyFile /etc/ssl/private/borsa.key`
* Creem un nou directori:`
```bash
<Directory /var/www/html/borsaBatoi/public>
  AllowOverride All
  Order Allow,Deny
  Allow from All
</Directory>
```

Configurem el lloc web no SSL en _/etc/apache2/sites-available_ per a que redireccione al SSL:
* ServerName: p.ej. `ServerName borsa.my`
* Redireccionem: `Redirect permanent  /  https://borsa.my/`
* DocumentRoot: `DocumentRoot /var/www/html/borsaBatoi/public`

Habilitem els sites si els hem creat nous:
```bash
sudo a2ensite borsa.conf
sudo a2ensite borsa-ssl.conf
```

Posem el nostre domini en el **/etc/hosts**:
```bash
127.0.0.1   borsa.my
```

Ara descarreguem l'aplicació des de Github:
```bash
git clone https://github.com/cipfpbatoi/borsaBatoi.git
```

A continuació cal asegurar-se que l'usuari www-data pot escriure dins del directori **storage**.

Per a finalitzar hem d'activar (si no ho estan ja) els mòduls **ssl** i **rewrite** i reiniciar apache:
```bash
sudo a2enmod ssl
sudo a2enmod rewrite
sudo systemctl restart apache2.service
```
ATENCIÓ: cal que estiga la carpeta borsaBatoi ja creada abans de reiniciar Apache per que no done un error.

## Configuració de l'aplicació del backend
Si estem desplegant per a producció necessitarem el gestor de dependències **composer** (en Homestead ja el tenim) així que ho [descarreguem](https://getcomposer.org/download/) en el directori de l'aplicació.

Des de la carpeta on tenim l'aplicació descarregada instal·lem les llibreries necessàries (això tardarà prou perquè ha de baixar-se moltes llibreries de Internet):
```bash
composer install     # en producció: php composer.phar install
```

Copiem el fitxer **.env**, que no es descarrega de git, des de **.env-example**. Allí hem de configurar:
- APP_NAME: Ponemos nuestro nombre (CIP FP Batoi)
- l'accés a la BBDD (DB_DATABASE, DB_USERNAME, DB_PASSWORD)
- el mail: MAIL_DRIVER (sendmail), MAIL_HOST (localhost), MAIL_PORT (25), MAIL_USERNAME (usuario del sistema que envía los e-mails), MAIL_PASSWORD (su contraseña), MAIL_ ENCRYPTION (null), MAIL_FROM_ADDRESS (borsatreball@cipfpbatoi.es), MAIL_FROM_NAME ("Borsa Treball Batoi")
- 

Creem la BBDD `borsatreball` i executem la migración (això no cal fer-ho si importem la BBDD en compte de crear-la):
```bash
php artisan migrate
php artisan db:seed
```

Hem de donar permisos d'escriptura a l'usuari **www-data** sobre la carpeta storage i el seu contingut.

Per a l'autenticació hem d'instal·lar [laravel/passport](https://laravel.com/docs/5.8/passport). A continuació executem el comando `passport:install` que crea las claus d'encriptació que s'utilitzen per a generar els tokens. A més crea els clients "personal access" i "password grant" clients which will be used to generate access tokens):
```bash
php artisan passport:install
```

Si has de tornar a crear la base de dades hauras d'executar `php artisan passport:client --personal` per a que es tornen a generar les taules que utilitza _passport_ per a autenticar als usuaris.

## Configurar el mail
Nosaltres hem instal·lat **`exim4`** i hem creat en el sistema l'usuari `usrmail` per a enviar els correus. Configurem exim4 amb `dpkg-reconfigure exim4-config`. El fitxer /etc/exim4/update-exim4.conf.conf hauria de quedar-se:
```bash
dc_eximconfig_configtype='satellite'    // o 'smartmail'
dc_other_hostnames=''
dc_local_interfaces=''
dc_readhost='borsa@nosaltres.com'
dc_relay_domains=''
dc_minimaldns='false'
dc_relay_nets=''
dc_smarthost='smtp.gmail.com:587'
CFILEMODE='644'
dc_use_split_config='false'
dc_hide_mailname='true'
dc_mailname_in_oh='true'
dc_localdelivery='mail_spool'
```

Configurem el compte de correu a utilitzar en /etc/exim4/passwd.client:
```bash
gmail-smtp.l.google.com:borsa@nosaltres.com:P@ssW0rd
*.google.com:borsa@nosaltres.com:P@ssW0rd
smtp.gmail.com:borsa@nosaltres.com:P@ssW0rd
```

I en el fitxer **`.env`** configurem:
```bash
MAIL_DRIVER=smtp
MAIL_HOST=localhost
MAIL_PORT=25
MAIL_USERNAME=usrmail
MAIL_PASSWORD=P@ssW0rd
MAIL_ENCRYPTION=null
MAIL_FROM_NAME="Borsa Treball Batoi"
MAIL_FROM_ADDRESS=borsa@nosaltres.com
```

## Configurar l'aplicació del backend
El que hem fet fins ara és preparar el nostre servidor per a rebre peticions de l'aplicació que utilitzarà l'usuari, que és la que anem a instal·lar ara.

### Descàrrega de l'aplicació del frontend per a desenvolupament
Si volem canviar l'aplicació ens descarregarem el repositoriA l'hora de descarregar el codi, des de la carpeta `~/code` inicialitzem git i descarregem l'aplicació:
```bash
git clone https://github.com/cipfpbatoi/borsatreball-front.git
```

