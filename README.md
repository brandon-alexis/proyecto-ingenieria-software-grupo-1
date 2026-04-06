<div align="center">

# Bus Web Application
## **Bus Traker**

Sistema de gestión de transporte público con geolocalización en tiempo real, rutas, pagos y gestión de usuarios.

<br>

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite)
![PNPM](https://img.shields.io/badge/PNPM-F69220?style=for-the-badge&logo=pnpm)

<br>

<a href="#instalacion"><kbd>Instalación</kbd></a> •
<a href="#RF"><kbd>RF</kbd></a> •
<a href="#RNF"><kbd>RNF</kbd></a> •
<a href="#HU"><kbd>HU</kbd></a> •

</div>


---
<a id="instalacion"></a>
<br>

## Instalación


> [!IMPORTANT]
> Necesitas tener instalado el gestor de paquetes `pnpm` para instalar los paquetes
> necesarios del proyecto y ejecutarlo para probarlo.

```bash
git clone https://github.com/brandon-alexis/Bus-WEb-Application-Design.git
cd Bus-WEb-Application-Design
pnpm install
pnpm dev
```
<a id="RF"></a>
<br>
## Requerimientos funcionales


<table>
  <thead>
    <tr>
      <th>ID</th>
      <th>Descripción</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>RF-01</td><td>El sistema debe registrar los buses con información como placa, código de identificación y capacidad total de pasajeros</td></tr>
    <tr>
      <td>RF-02</td>
      <td>El sistema debe registrar las paradas del bus con su nombre y ubicación geográfica</td>
    </tr>
    <tr>
      <td>RF-03</td>
      <td>El sistema debe registrar las rutas del bus asociando las paradas correspondientes</td>
    </tr>
    <tr>
      <td>RF-04</td>
      <td>El sistema debe registrar el usuario</td>
    </tr>
    <tr>
      <td>RF-05</td>
      <td>El sistema debe mostrar la ubicación geográfica actualizada del bus en tiempo real</td>
    </tr>
    <tr>
      <td>RF-06</td>
      <td>El sistema debe permitir editar y eliminar información de buses, rutas y paradas</td>
    </tr>
    <tr>
      <td>RF-07</td>
      <td>El sistema debe mostrar la ruta del bus en el mapa</td>
    </tr>
    <tr>
      <td>RF-08</td>
      <td>El sistema debe mostrar la capacidad total de pasajeros del bus</td>
    </tr>
    <tr>
      <td>RF-09</td>
      <td>El sistema debe mostrar la disponibilidad de puestos del bus en tiempo real</td>
    </tr>
    <tr>
      <td>RF-10</td>
      <td>El sistema debe permitir buscar rutas según origen y destino</td>
    </tr>
    <tr>
      <td>RF-11</td>
      <td>El sistema debe calcular el tiempo estimado de llegada del bus a cada parada</td>
    </tr>
    <tr>
      <td>RF-12</td>
      <td>El sistema debe mostrar el tiempo estimado de llegada del bus a la parada seleccionada</td>
    </tr>
    <tr>
      <td>RF-13</td>
      <td>El sistema debe mostrar un estimado del costo del recorrido</td>
    </tr>
    <tr>
      <td>RF-14</td>
      <td>El sistema debe generar alertas en caso de retraso del bus</td>
    </tr>
    <tr>
      <td>RF-15</td>
      <td>El sistema debe permitir diferentes roles</td>
    </tr>
    <tr>
      <td>RF-16</td>
      <td>El sistema puede permitir recomendaciones de rutas alternas</td>
    </tr>
    <tr>
      <td>RF-17</td>
      <td>El sistema debe permitir registrar fallas o incidentes</td>
    </tr>
    <tr>
      <td>RF-18</td>
      <td>El sistema debe permitir integración de pagos</td>
    </tr>
    <tr>
      <td>RF-19</td>
      <td>El sistema debe permitir autenticación de usuarios</td>
    </tr>
    <tr>
      <td>RF-20</td>
      <td>El sistema debe calificar el servicio del bus y conductor</td>
    </tr>
  </tbody>
</table>

<a id="RNF"></a>
<br>
# Requerimientos no funcionales

<table>
  <thead>
    <tr>
      <th>ID</th>
      <th>Descripción</th>
      <th>Dimensión</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>RNF-1</td>
      <td>El sistema debe responder a las solicitudes de los usuarios en menos de 3 segundos</td>
      <td>Rendimiento</td>
    </tr>
    <tr>
      <td>RNF-2</td>
      <td>El sistema debe encriptar la contraseña cuando los usuarios se registran</td>
      <td>Seguridad</td>
    </tr>
    <tr>
      <td>RNF-3</td>
      <td>El sistema debe mantener una precisión mínima de 10 metros respecto a la ubicación del bus en tiempo real</td>
      <td>Rendimiento</td>
    </tr>
    <tr>
      <td>RNF-4</td>
      <td>El sistema debe actualizar el estado de la disponibilidad de los asientos del bus con un retraso máximo de 3 segundos</td>
      <td>Rendimiento</td>
    </tr>
    <tr>
      <td>RNF-5</td>
      <td>El sistema debe mostrar alertas de retraso visualmente distintivas junto a sus causas y el nuevo tiempo estimado de llegada</td>
      <td>Usabilidad</td>
    </tr>
    <tr>
      <td>RNF-6</td>
      <td>El sistema debe soportar un volumen de 500 usuarios concurrentes sin presentar disminución en el rendimiento</td>
      <td>Rendimiento</td>
    </tr>
    <tr>
      <td>RNF-7</td>
      <td>El sistema debe actualizar el estado del tráfico y el tiempo estimado de llegada a cada parada en menos de 3 segundos</td>
      <td>Rendimiento</td>
    </tr>
    <tr>
      <td>RNF-8</td>
      <td>El sistema debe ser compatible con iOS (versión actual y dos anteriores) y Android (versión 10 en adelante)</td>
      <td>Portabilidad</td>
    </tr>
  </tbody>
</table>

<a id="HU"></a>
<br>
# Historias de Usuario


- [x] HU-1: Como administrador quiero registrar la información de los buses (placa, código e identificación y capacidad) para almacenar los datos de los buses.
- [ ] HU-2: Como pasajero quiero consultar la información de los buses para conocer sus datos básicos.
- [x] HU-3: Como administrador quiero registrar paradas con nombre y ubicación para definir el recorrido.
- [x] HU-4: Como pasajero quiero registrarme para acceder a la aplicación.
- [x] HU-5: Como pasajero quiero ver la ubicación del bus en tiempo real.
- [x] HU-6: Como pasajero quiero ver la ruta del bus en el mapa.
- [ ] HU-7: Como pasajero quiero ver la capacidad del bus.
- [x] HU-8: Como pasajero quiero ver disponibilidad de asientos.
- [x] HU-9: Como administrador quiero calcular tiempos de llegada.
- [x] HU-10: Como pasajero quiero ver el tiempo estimado.
- [x] HU-11: Como pasajero quiero ver el costo del recorrido.
- [x] HU-12: Como pasajero quiero ver alertas de retraso.
- [x] HU-13: Como administrador quiero gestionar roles.
- [ ] HU-14: Como pasajero quiero recibir recomendaciones de rutas.
- [ ] HU-15: Como conductor quiero reportar fallas.
- [x] HU-16: Como pasajero quiero pagar con distintos métodos.
- [ ] HU-17: Como pasajero quiero calificar el servicio del conductor.
- [ ] HU-18: Como administrador quiero actualizar la información de los buses para mantener los datos correctos.
- [ ] HU-19: Como administrador quiero editar paradas para corregir errores.
- [ ] HU-20: Como pasajero quiero ver las paradas en el mapa para ubicarme.
- [ ] HU-21: Como administrador quiero crear rutas asociando paradas.
- [ ] HU-22: Como administrador quiero modificar rutas para optimizar recorridos.
- [ ] HU-23: Como pasajero quiero consultar rutas disponibles.
- [ ] HU-24: Como usuario quiero validar mis datos al registrarme.
- [ ] HU-25: Como usuario quiero recibir confirmación de registro.
- [ ] HU-26: Como pasajero quiero ver actualizaciones constantes de ubicación.
- [ ] HU-27: Como pasajero quiero comparar la ubicación del bus con la mía.
- [ ] HU-28: Como administrador quiero editar información del sistema.
- [ ] HU-29: Como administrador quiero eliminar registros obsoletos.
- [ ] HU-30: Como administrador quiero confirmar cambios realizados.
- [ ] HU-31: Como pasajero quiero identificar paradas en la ruta.
- [ ] HU-32: Como pasajero quiero seguir el recorrido del bus.
- [ ] HU-33: Como administrador quiero registrar la capacidad.
- [ ] HU-34: Como pasajero quiero comparar capacidades.
- [ ] HU-35: Como pasajero quiero ver cambios en tiempo real.
- [ ] HU-36: Como pasajero quiero decidir si abordar.
- [ ] HU-37: Como pasajero quiero buscar rutas por origen y destino.
- [ ] HU-38: Como pasajero quiero filtrar rutas.
- [ ] HU-39: Como pasajero quiero elegir la mejor ruta.
- [ ] HU-40: Como sistema quiero recalcular tiempos automáticamente.
- [ ] HU-41: Como pasajero quiero confiar en los tiempos.
- [ ] HU-42: Como pasajero quiero ver actualizaciones del tiempo.
- [ ] HU-43: Como pasajero quiero planificar mi salida.
- [ ] HU-44: Como pasajero quiero comparar costos.
- [ ] HU-45: Como pasajero quiero planificar mi gasto.
- [ ] HU-46: Como pasajero quiero ver la causa del retraso.
- [ ] HU-47: Como pasajero quiero conocer el nuevo tiempo.
- [ ] HU-48: Como administrador quiero asignar permisos.
- [ ] HU-49: Como sistema quiero restringir accesos.
- [ ] HU-50: Como pasajero quiero comparar alternativas.
- [ ] HU-51: Como pasajero quiero elegir la mejor opción.
- [ ] HU-52: Como pasajero quiero reportar incidentes.
- [ ] HU-53: Como sistema quiero almacenar reportes.
- [ ] HU-54: Como pasajero quiero pagar electrónicamente.
- [ ] HU-55: Como sistema quiero calcular tarifas automáticamente.
- [ ] HU-56: Como usuario quiero iniciar sesión.
- [ ] HU-57: Como usuario quiero cerrar sesión.
- [ ] HU-58: Como sistema quiero validar credenciales.
- [ ] HU-59: Como pasajero quiero evaluar al conductor.
- [ ] HU-60: Como sistema quiero almacenar calificaciones.
