import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SearchComponent } from './search/search.component';

import { AdminComponent } from './admin/admin.component';
import { RoomsComponent } from './rooms/rooms.component';
import { HttpClient } from '@angular/common/http';
import { ConocenosComponent } from './conocenos/conocenos.component';
import { PagoComponent } from './pago/pago.component';
import { ConsultComponent } from './consult/consult.component';
import { PrepagoComponent } from './prepago/prepago.component';
import { ConfirmacionComponent } from './confirmacion/confirmacion.component';
import { ShowRoomsComponent } from './show-rooms/show-rooms.component';
import { PopUpUpdateReservationComponent } from './pop-up-update-reservation/pop-up-update-reservation.component';

const routeConfig: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home page',
    data: { customContent: `
      <div>
        <div>
          <h2>
            ENCUENTRATE Y EXPLORA LAS MARAVILLAS DEL BOSQUE LLUVIOSO
          </h2>
          <h3>
            Experimente La Escencia De La Vida.
          </h3>
          <div>
            <button type="button">Conócenos</button>
            <div>
              <p>Quieres unirtenos? &#11106;</p>
            </div>
          </div>
        </div>
        <div>
          <img src='data:image/jpeg;base64,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'></img>
        </div>
      </div>
      ` }
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Log In',
    data: { title: 'Login Dynamic Title', description: 'Login Dynamic Description'}
  },
  {
    path: 'adminHome',
    component: AdminComponent,
    title: 'Admin Home',
    data: { title: 'Admin Home Dynamic Title', description: 'Admin Home Dynamic Description'}
  },
  {
    path: 'showRooms',
    component: ShowRoomsComponent,
    title: 'All Rooms',
    data: { title: 'Hotel Rooms', description: 'Aqui se presenta todas las habitaciones disponibles para nuestro hotel "Copo de Nieve" :)'}
  },
  {
    path: 'rooms',
    component: RoomsComponent,
    title: 'Habitaciones',
    data: { title: 'Habitaciones', description: 'Mashpi fue diseñado para ofrecer una completa inmersión en el bosque nublado, y a la vez mantiene a la fauna a una prudente distancia. El lodge es un retiro de lujo en medio de los exuberantes bosques e impresionantes paisajes. Las habitaciones se encuentran distribuidas en tres plantas y todas poseen ventanales panorámicos de piso a techo y de pared a pared, el bosque siempre está visible.'}
  },
  {
    path: 'search',
    component: SearchComponent,
    title: 'Reserva',
    data: { title: 'Reserva', description: 'Mashpi fue diseñado para ofrecer una completa inmersión en el bosque nublado, y a la vez mantiene a la fauna a una prudente distancia. El lodge es un retiro de lujo en medio de los exuberantes bosques e impresionantes paisajes. Las habitaciones se encuentran distribuidas en tres plantas y todas poseen ventanales panorámicos de piso a techo y de pared a pared, el bosque siempre está visible.'}
  },
  {
    path: 'about',
    component: ConocenosComponent,
    title: 'Conocenos',
    data: { title: 'Conocenos', description: 'Somos una empresa comprometida con el ambiente, con el turismo internacional y con el Ecuador. Nuestra meta es establecer relaciones internacionales de valor que logren promover al Ecuador y a Mashpi como los iconos en la industria turistica internacional. Vamos a llevar el potencial turistico del Ecuador a un nuevo nivel, y demostrar la naturaleza al mundo para que las personas se conecten nuevamente con lo natural. Nuestros espacios integran tanto el aspecto humano de la arquitectura y los espacios de convivencia, con el bosque, los arboles, la flora y la fauna autoctonas del Ecuador y la region andina.' }
  },
  {
    path: 'pago',
    component: PagoComponent,
    title: 'Pago',
    data: { title: 'Pago', description: 'En esta pestaña podrás completar tu reservación con total seguridad. Aceptamos PayPal.' }
  },
  {
    path: 'consult',
    component: ConsultComponent,
    title: 'Consultar Reserva',
    data: { title: 'Consultar Reserva', description: 'En esta pestaña podrás consultar su reserva.' }
  },
  {
    path: 'prepago',
    component: PrepagoComponent,
    title: 'Datos del Cliente',
    data: { title: 'Prepago', description: 'En esta pestaña ingrese sus datos para la reserva.' }
  },
  {
    path: 'confirmacion',
    component: ConfirmacionComponent,
    title: 'Reserva Confirmada',
    data: { title: 'Gracias por confiar en Hotel Copo de Nieve' }
  },
  {
    path: 'reservationPopUp',
    component: PopUpUpdateReservationComponent,
    title: 'Pop Up - Take a peek',
    data: { title: 'Gracias por confiar en Hotel Copo de Nieve' }
  }
];


export default routeConfig;