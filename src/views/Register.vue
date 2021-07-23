<template>
  <v-card>
    <v-card-title class="grey lighten-4 py-4 title">
      {{ modPerfil ? "Editar" : "Nou" }} usuari
      <v-spacer></v-spacer>
      <v-btn>Canvia contrasenya</v-btn>
    </v-card-title>
    <validation-observer ref="observer">
      <v-form @submit.prevent="submit" lazy-validation>
        <v-container>
          <template v-if="modPerfil">
            <v-text-field
              v-model="user.email"
              label="e-mail"
              disabled
            ></v-text-field>
          </template>
          <template v-else>
            <v-row>
              <v-col cols="12" sm="6">
                <validation-provider
                  name="e-Mail"
                  v-slot="{ errors }"
                  rules="required|email"
                  vid="email"
                >
                  <v-text-field
                    v-model="user.email"
                    label="e-mail"
                    :error-messages="errors"
                    placeholder="Introduix el email amb el qual et loguejaràs"
                    @change="checkUserMail"
                  ></v-text-field>
                </validation-provider>
              </v-col>

              <v-col cols="12" sm="3">
                <validation-provider
                  name="Contrasenya"
                  v-slot="{ errors }"
                  rules="required|min:6"
                >
                  <v-text-field
                    v-model="user.password"
                    :counter="10"
                    label="Contrasenya"
                    title="Contrasenya"
                    :error-messages="errors"
                    :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="show ? 'text' : 'password'"
                    @click:append="show = !show"
                  ></v-text-field>
                </validation-provider>
              </v-col>

              <v-col cols="12" sm="3">
                <validation-provider
                  name="Confirmacio"
                  v-slot="{ errors }"
                  rules="required|password:@Contrasenya"
                >
                  <v-text-field
                    v-model="user.password_confirmation"
                    label="Contrasenya"
                    :error-messages="errors"
                    :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="show ? 'text' : 'password'"
                    @click:append="show = !show"
                  ></v-text-field>
                </validation-provider>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-radio-group v-model="user.rol" row>
                  <v-label>Indica per a què vols utilitzar la bolsa</v-label>
                  <validation-provider
                    name="Rol"
                    v-slot="{ errors }"
                    rules="required"
                    vid="rol"
                  >
                    <v-radio
                      label="Buscar treball"
                      :error-messages="errors"
                      :value="ROL_TRABAJADOR"
                    ></v-radio>
                  </validation-provider>
                  <v-radio
                    label="Oferir treball"
                    :value="ROL_EMPLEADOR"
                  ></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
          </template>
          <v-card v-if="user.rol === ROL_EMPLEADOR">
            <v-card-title>Datos de la empresa</v-card-title>
            <v-row>
              <v-col cols="12" sm="3">
                <validation-provider
                  name="CIF"
                  v-slot="{ errors }"
                  rules="regex:/^[a-zA-Z0-9]\d{7}[a-zA-Z0-9]$/"
                >
                  <v-text-field
                    label="CIF"
                    placeholder="CIF"
                    v-model="user.cif"
                    :error-messages="errors"
                    mask="N#######N"
                    counter="9"
                  ></v-text-field>
                </validation-provider>
              </v-col>
              <v-col cols="12" sm="9">
                <validation-provider
                  name="Nom"
                  v-slot="{ errors }"
                  rules="required|max:25"
                >
                  <v-text-field
                    label="Nom de l'empresa"
                    v-model="user.nombre"
                    :error-messages="errors"
                    counter="25"
                  ></v-text-field>
                </validation-provider>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="8">
                <validation-provider
                  name="Domicili"
                  v-slot="{ errors }"
                  rules="required|max:80"
                >
                  <v-textarea
                    label="Domicil·li"
                    placeholder="Domicil·li"
                    v-model="user.domicilio"
                    :counter="80"
                    :error-messages="errors"
                    required
                  ></v-textarea>
                </validation-provider>
              </v-col>
              <v-col cols="12" sm="4">
                <v-row>
                  <validation-provider
                    name="Localitat"
                    v-slot="{ errors }"
                    rules="required|max:25"
                  >
                    <v-text-field
                      label="Localitat"
                      v-model="user.localidad"
                      :error-messages="errors"
                      counter="25"
                    ></v-text-field>
                  </validation-provider>
                </v-row>
                <v-row>
                  <validation-provider
                    name="Telefon"
                    v-slot="{ errors }"
                    rules="max:25"
                  >
                    <v-text-field
                      label="Telèfon"
                      v-model="user.telefono"
                      :error-messages="errors"
                      counter="25"
                    ></v-text-field>
                  </validation-provider>
                </v-row>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6">
                <validation-provider
                  name="Contacte"
                  v-slot="{ errors }"
                  rules="required|max:50"
                >
                  <v-text-field
                    label="Persona de contacte"
                    v-model="user.contacto"
                    :error-messages="errors"
                    counter="50"
                  ></v-text-field>
                </validation-provider>
              </v-col>
              <v-col cols="12" sm="6">
                <validation-provider
                  name="Web"
                  v-slot="{ errors }"
                  rules="max:50"
                >
                  <v-text-field
                    label="Pàgina web"
                    v-model="user.web"
                    :error-messages="errors"
                    counter="50"
                  ></v-text-field>
                </validation-provider>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="12">
                <validation-provider
                  name="Descripcio"
                  v-slot="{ errors }"
                  rules="max:200"
                >
                  <v-textarea
                    label="Descripció"
                    v-model="user.descripcion"
                    :error-messages="errors"
                    counter="200"
                  ></v-textarea>
                </validation-provider>
              </v-col>
            </v-row>
          </v-card>
          <v-card v-if="user.rol === ROL_TRABAJADOR">
            <v-card-title>Datos del trabajador</v-card-title>
            <v-row>
              <v-col cols="12" sm="4">
                <validation-provider
                  name="Nom"
                  v-slot="{ errors }"
                  rules="required|max:25"
                >
                  <v-text-field
                    label="Nom"
                    placeholder="Nom"
                    v-model="user.nombre"
                    :error-messages="errors"
                    counter="25"
                  ></v-text-field>
                </validation-provider>
              </v-col>
              <v-col cols="12" sm="8">
                <validation-provider
                  name="Cogoms"
                  v-slot="{ errors }"
                  rules="required|max:50"
                >
                  <v-text-field
                    label="Cogoms"
                    v-model="user.apellidos"
                    :error-messages="errors"
                    counter="50"
                  ></v-text-field>
                </validation-provider>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="8">
                <validation-provider
                  name="Domicili"
                  v-slot="{ errors }"
                  rules="max:80"
                >
                  <v-textarea
                    label="Domicil·li"
                    placeholder="Domicil·li"
                    v-model="user.domicilio"
                    :counter="80"
                    :error-messages="errors"
                    required
                  ></v-textarea>
                </validation-provider>
              </v-col>
              <v-col cols="12" sm="4">
                <v-row>
                  <validation-provider
                    name="Borsa"
                    v-slot="{ errors }"
                    rules="required"
                    vid="bolsa"
                  >
                    <v-checkbox
                      label="Borsa treball"
                      v-model="user.bolsa"
                      :error-messages="errors"
                      hint="Vuig rebre ofertes de la borsa"
                      persistent-hint
                    ></v-checkbox>
                  </validation-provider>
                </v-row>
                <v-row>
                  <validation-provider name="Info" v-slot="{ errors }">
                    <v-checkbox
                      label="Rebre info"
                      v-model="user.info"
                      :error-messages="errors"
                      hint="Vuig rebre altres informacions"
                      persistent-hint
                    ></v-checkbox>
                  </validation-provider>
                </v-row>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="8">
                <validation-provider
                  name="Curriculum"
                  v-slot="{ errors }"
                  rules="max:80"
                >
                  <v-text-field
                    type="web"
                    label="Curriculum"
                    placeholder="Enllaç al teu curriculum"
                    v-model="user.contacto"
                    :error-messages="errors"
                    counter="80"
                  ></v-text-field>
                </validation-provider>
              </v-col>
              <v-col cols="12" sm="4">
                <validation-provider
                  name="Telefon"
                  v-slot="{ errors }"
                  rules="max:25"
                >
                  <v-text-field
                    label="Telèfon"
                    v-model="user.telefono"
                    :error-messages="errors"
                    counter="25"
                  ></v-text-field>
                </validation-provider>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <template v-if="!showDialogCiclos">
                  <v-label
                    >Cicles finalitzats (en verd els ja validats pel
                    responsable)</v-label
                  >
                  <br />
                  <ciclo-chip
                    v-for="ciclo in user.ciclos"
                    :key="ciclo.id_ciclo"
                    :data="ciclo"
                  ></ciclo-chip>
                  <v-btn @click="openDialogCiclos">Modificar cicles</v-btn>
                </template>
                <validation-provider
                  v-else
                  name="Cicles"
                  v-slot="{ errors }"
                  rules="required"
                >
                  <v-select
                    v-if="modPerfil"
                    :items="ciclosCategorized"
                    v-model="user.ciclosSelect"
                    item-text="ciclo"
                    item-value="id"
                    label="Cicles finalitzats"
                    multiple
                    chips
                    persistent-hint
                    :error-messages="errors"
                  >
                    <template v-slot:selection="data">
                      <v-chip
                        v-bind="data.attrs"
                        :input-value="data.selected"
                        close
                        @click="data.select"
                        @click:close="removeItemSelected(data.item)"
                      >
                        {{ data.item.ciclo }}
                      </v-chip>
                    </template>
                    <template v-slot:item="data">
                      <template v-if="typeof data.item !== 'object'">
                        <v-list-item-content
                          v-text="data.item"
                        ></v-list-item-content>
                      </template>
                      <template v-else>
                        <v-list-item-content>
                          <v-list-item-title
                            v-html="data.item.ciclo"
                          ></v-list-item-title>
                        </v-list-item-content>
                      </template>
                    </template>
                  </v-select>
                  <v-select
                    v-else
                    :items="ciclos"
                    v-model="user.ciclos"
                    item-text="ciclo"
                    item-value="id"
                    label="Cicles finalitzats"
                    :error-messages="errors"
                    multiple
                    chips
                    persistent-hint
                  ></v-select>
                </validation-provider>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <validation-provider
                  name="Condicions"
                  v-slot="{ errors }"
                  rules="required"
                  vid="accept"
                >
                  <v-checkbox
                    xs12
                    v-model="user.accept"
                    label="Acepte la Política de privacitat de la Borsa de Treball"
                    :error-messages="errors"
                  ></v-checkbox>
                </validation-provider>
                <div xs6 class="font-weight-bold">
                  Al registrar-se enviant aquest formulari està acceptant la
                  <a href="/privacitat">Política de privacitat</a> i donant la
                  seua <br />conformitat al tractament de les seues dades
                  personals en els teminis i condicions allí indicades.
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-container>

        <v-card-actions>
          <help-button v-if="helpPage" :page="helpPage"></help-button>
          <v-spacer></v-spacer>
          <v-btn type="submit" class="primary">Guarda</v-btn>
        </v-card-actions>
      </v-form>
    </validation-observer>
    <v-dialog v-model="showDialogCiclos" max-width="500px">
      <dialog-edit-ciclos
        :ciclos="user.ciclos"
        @close="closeDialogCiclos"
      />
    </v-dialog>
  </v-card>
</template>

<script>
import API from "@/service/API";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { extend, localize } from "vee-validate";
import es from "vee-validate/dist/locale/es.json";
import { required, email, min, max, regex } from "vee-validate/dist/rules";
import HelpButton from "../components/HelpButton";
import CONSTANTS from "@/app.constants";
import CicloChip from "../components/CicloChip.vue";
import DialogEditCiclos from "../components/DialogEditCiclos.vue";

localize("es", es);
extend("required", required);
extend("email", email);
extend("min", min);
extend("max", max);
extend("regex", regex);
extend("password", {
  params: ["target"],
  validate(value, { target }) {
    return value === target;
  },
  message: "Les contrasenyes no concorden",
});

export default {
  name: "register",
  components: {
    HelpButton,
    ValidationObserver,
    ValidationProvider,
    CicloChip,
    DialogEditCiclos,
  },
  mounted() {
    if (this.modPerfil) {
      this.user = this.$store.getters.getUser;
      switch (this.user.rol) {
        case this.ROL_EMPLEADOR:
          this.table = "empresas";
          break;
        case this.ROL_TRABAJADOR:
          this.table = "alumnos";
          break;
        default:
          this.table = "responsables";
          break;
      }
      this.$store.commit("setTitle", {
        title: "El teu perfil",
        helpPage: "perfil",
      });
      API.table
        .getItem(this.table, this.user.id)
        .then((data) => {
          this.user = Object.assign(
            {},
            this.$store.getters.getUser,
            data.data.data
          );
        })
        .catch((error) => this.$store.commit("setError", error));
    } else {
      this.$store.commit("setTitle", {
        title: "Crear compte",
        helpPage: "registro",
      });
    }
  },
  data: () => ({
    helpPage: "login",
    user: {},
    show: false,
    customErrors: {},
    table: "",
    showDialogCiclos: false,
    editedCiclos: [],
  }),
  computed: {
    ciclosCategorized() {
      return this.$store.state.ciclosCategorized;
    },
    ciclos() {
      return this.$store.state.ciclos;
    },
    ROL_EMPLEADOR() {
      return CONSTANTS.ROL_EMPLEADOR;
    },
    ROL_TRABAJADOR() {
      return CONSTANTS.ROL_TRABAJADOR;
    },
    modPerfil() {
      return this.$route.name === "Perfil";
    },
  },
  methods: {
    checkUserMail() {
      API.users
        .checkEmailAvailable(this.user.email)
        .then((response) => {
          if (!response.data.data) {
            this.customErrors.email = "Aquest email ja està registrat";
            this.$refs.observer.setErrors(this.customErrors);
          } else {
            this.customErrors.email = "";
            //this.$refs.observer.setErrors({ email: ''});
          }
        })
        .catch((error) => this.$store.commit("setError", error));
    },
    async submit() {
      // Validamos a mano algunas cosas
      if (this.customErrors.email) {
        this.customErrors = {
          email: this.customErrors.email,
        };
      } else {
        this.customErrors = {};
      }

      if (!this.user.rol) {
        this.customErrors.rol = "Ha de triar un rol";
        alert("Has de triar un rol: Buscar o Oferir treball");
      }
      if (!this.user.bolsa) {
        this.customErrors.bolsa =
          "Si no marques aquesta casella no pots forma part de la Borsa";
      }
      if (!this.user.accept) {
        this.customErrors.accept =
          "Ha d'aceptar les condicions i la política de privacitat de la Borsa";
      }
      if (!this.user.ciclos.length) {
        this.customErrors.ciclosSelect = "Has de marcar al menys 1 cicle";
      }
      const hasCustomErrors = Object.keys(this.customErrors).length;
      const valid = await this.$refs.observer.validate();

      if (hasCustomErrors) {
        this.$refs.observer.setErrors(this.customErrors);
      } else if (valid) {
        this.registerUser();
      }
    },

    registerUser() {
      if (this.modPerfil) {
        this.$store
          .dispatch("saveItemToTable", {
            table: this.table,
            item: this.user,
          })
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        API.users
          .register(this.user)
          .then((response) => {
            if (response.status == 201) {
              this.$store.commit("loginUser", response.data.data);
              this.$store.dispatch("getTable", { table: "menu" });
              this.$router.push("ofertas");
            } else {
              this.customErrors = response.errors;
              this.$refs.observer.setErrors(this.customErrors);
              this.$store.commit("setError", response.message);
            }
          })
          .catch((response) => {
            this.$store.commit("setError", response.message || response);
            if (response.response.data.errors) {
              this.customErrors = response.response.data.errors;
              this.$refs.observer.setErrors(this.customErrors);
            }
          });
      }
    },

    openDialogCiclos() {
      this.editedCiclos = this.user.ciclos
        ? this.user.ciclos.map((item) => item.id_ciclo)
        : [];
      this.showDialogCiclos = true;
    },
    closeDialogCiclos(ciclos) {
      this.showDialogCiclos = false;
      if (ciclos) {
        // Quitamos los eliminados
        this.user.ciclos.forEach((ciclo, index) => {
          if (!ciclo.validado && !ciclos.includes(ciclo.id_ciclo)) {
            this.user.ciclos.splice(index, 1);
          }
        });
        // Añadimos los nuevos
        ciclos.forEach((cicloId) => {
          if (!this.user.ciclos.find((ciclo) => ciclo.id_ciclo === cicloId)) {
            this.user.ciclos.push({
              id_alumno: this.user.id,
              id_ciclo: cicloId,
              any: null,
              validado: false,
            });
          }
        });

        // Modificamos el perfil
        this.$store.dispatch('saveItemToTable', this.user)
        .then((data) => {
          for (let prop in data) {
            this.user[prop] = data.prop
          }
          this.$store.commit('loginUser', this.user)
          this.$store.commit('setError', {
            msg: 'El perfil se ha guardado correctamente',
            type: 'success',
          })
        })
        .catch((err) => {
          console.log(err)
        })
      }
    },
  },
};
</script>