import { UserDocument } from 'control-risk/schemas/user.schema';
import * as path from 'path';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { promises } from 'fs';

export async function generateCarnet(
  users: UserDocument,
  config?: {
    rootPath?: string;
  },
): Promise<TDocumentDefinitions> {
  const image = await promises.readFile(
    path.join(
      config?.rootPath ?? path.resolve(),
      `carnets/${users.carnet}.jpg`,
    ),
    { encoding: 'base64' },
  );
  const qrCertificates = new URL(
    users.userInformation.certificates ?? 'https://example.com',
  );
  qrCertificates.searchParams.append('carnet', users.carnet);
  console.group('**** PATH ****');
  console.log(image);
  console.log(
    path.join(config?.rootPath ?? path.resolve(), 'carnets/ga181935.jpg'),
  );
  console.groupEnd();
  return {
    pageOrientation: 'landscape',
    content: [
      {
        columns: [
          {
            style: 'tableExample',
            table: {
              widths: [240],
              body: [
                [
                  {
                    columns: [
                      {
                        image: path.join(
                          path.resolve(),
                          'assets/carnet_img_logo_total.png',
                        ),
                        width: 30,
                        margin: [0, 5, 0, 0],
                      },
                      [
                        {
                          text: 'International Control Risk Group S.A. de C.V.',
                          style: 'header',
                          alignment: 'center',
                          fontFeatures: ['Century'],
                          margin: [0, 5, 0, 0],
                        },
                        {
                          text: 'Consultoría, Asesoría y Servicios Privados de Seguridad Integral  51ª Avenida Norte Nº 147, Col. Flor Blanca. San Salvador, El Salvador.',
                          style: 'text',
                          alignment: 'center',
                          margin: [0, 3],
                        },
                        {
                          text: 'PBX (503) 2266 9600 https://www.controlrisk.com.sv',
                          style: 'text',
                          alignment: 'center',
                          margin: 0,
                        },
                      ],
                    ],
                    margin: [8, 5],
                    columnGap: 5,
                  },
                ],
                [
                  [
                    {
                      columns: [
                        [
                          {
                            text: `${users.userInformation.lastname}, ${users.userInformation.name}`,
                            style: 'name',
                            margin: [20, 20, 20, 0],
                          },
                          {
                            text: 'Agente de Seguridad',
                            style: 'subname',
                            margin: [20, 3, 0, 0],
                          },
                          {
                            text: users.carnet,
                            style: 'subname2',
                            margin: [20, 3, 0, 0],
                          },
                        ],
                        {
                          svg: `<svg width="58.5" height="73.1"> 
                                  <defs>
                                    <clipPath id="circleView" x="50%" y="50%" dominant-baseline="middle"> 
                                  <rect id="rect" x="2" y="2" width="54.5" height="69.1" rx="8px" ry="8px" /> 
                                  </clipPath> 
                                  </defs>
                                    <rect id="border" width="100%" height="100%" rx="8px" ry="8px" fill="#00267A" />
                                    <image x="0" height="100%" href="data:image/jpeg;base64,${image}"
                                      clip-path="url(#circleView)" /> 
                                  </svg>`,
                          width: 58.5,
                          margin: [0, 0, 10, 5],
                          alignment: 'center',
                        },
                      ],
                    },
                  ],
                ],
              ],
            },
            layout: {
              hLineWidth: function (i) {
                console.log(i, 'node');
                return i === 1 ? 0 : 0.2;
              },
              vLineWidth: function () {
                return 0.2;
              },
              hLineColor: function () {
                return '#00267A';
              },
              vLineColor: function () {
                return '#00267A';
              },
              // hLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
              // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
              // paddingLeft: function(i, node) { return 4; },
              // paddingRight: function(i, node) { return 4; },
              // paddingTop: function(i, node) { return 2; },
              // paddingBottom: function(i, node) { return 2; },
              // fillColor: function (rowIndex, node, columnIndex) { return null; }
            },
          },
          {
            style: 'tableExample',
            table: {
              widths: [240],
              body: [
                [
                  {
                    text: 'NUESTRA DOCTRINA DICE QUE NO HAY MISIÓN QUE NO PODAMOS CUMPLIR',
                    style: 'header2',
                    alignment: 'center',
                    margin: [0, 5, 0, 0],
                  },
                ],
                [
                  [
                    {
                      image: path.join(
                        path.resolve(),
                        'assets/carnet_img_logo.jpeg',
                      ),
                      width: 91,
                      alignment: 'center',
                      margin: [0, 0, 0, 5],
                    },
                    // Inicio DUI
                    {
                      text: 'DUI:',
                      style: 'label',
                      relativePosition: {
                        y: -105,
                        x: 20,
                      },
                    },
                    {
                      text: users.userInformation.dui,
                      style: 'value',
                      relativePosition: {
                        y: -105,
                        x: 40,
                      },
                    },
                    // FIN DUI
                    // Inicio NIT
                    /*                     {
                      text: 'NIT:',
                      style: 'label',
                      relativePosition: {
                        y: -90,
                        x: 20,
                      },
                    },
                    {
                      text: users.userInformation.init,
                      style: 'value',
                      relativePosition: {
                        y: -90,
                        x: 40,
                      },
                    }, */
                    // Inicio ISSS
                    {
                      text: 'ISSS:',
                      style: 'label',
                      relativePosition: {
                        y: -90,
                        x: 20,
                      },
                    },
                    {
                      text: users.userInformation.isss,
                      style: 'value',
                      relativePosition: {
                        y: -90,
                        x: 40,
                      },
                    },
                    // FIN ISSS
                    // Inicio NUP
                    {
                      text: 'NUP:',
                      style: 'label',
                      relativePosition: {
                        y: -75,
                        x: 20,
                      },
                    },
                    {
                      text: users.userInformation.afpNup,
                      style: 'value',
                      relativePosition: {
                        y: -75,
                        x: 40,
                      },
                    },
                    // Fin NUP

                    // Fin NIT
                    // Inicio Tipo Sanguineo
                    {
                      text: 'Tipo Sanguíneo:',
                      style: 'label',
                      relativePosition: {
                        y: -60,
                        x: 20,
                      },
                    },
                    {
                      text: users.userInformation.bloodType,
                      style: 'value',
                      relativePosition: {
                        y: -60,
                        x: 75,
                      },
                    },
                    // Fin tipo sanguineo
                    // Inicio Emision
                    {
                      text: 'EMISION:',
                      style: 'label',
                      relativePosition: {
                        y: -45,
                        x: 20,
                      },
                    },
                    {
                      text: users.userInformation.issuedAt,
                      style: 'value',
                      relativePosition: {
                        y: -45,
                        x: 50,
                      },
                    },
                    // Fin emision
                    // Inicio Venc
                    {
                      text: 'VENCIMIENTO:',
                      style: 'label',
                      relativePosition: {
                        y: -30,
                        x: 20,
                      },
                    },
                    {
                      text: users.userInformation.expireAt,
                      style: 'value',
                      relativePosition: {
                        y: -30,
                        x: 65,
                      },
                    },
                    {
                      qr: qrCertificates.origin + qrCertificates.search,
                      fit: 100,
                      relativePosition: {
                        y: -105,
                        x: 130,
                      },
                    },

                    // fin Venc
                    {
                      text: 'EN CASO DE ACCIDENTE, EXTRAVÍO, VERIFICACIÓN DE DATOS O REPORTE DE ANOMALÍAS, FAVOR COMUNICARSE AL TELÉFONO 2266-9600',
                      alignment: 'center',
                      style: 'text',
                    },
                  ],
                ],
              ],
            },
            layout: {
              hLineWidth: function (i) {
                return i === 1 ? 0 : 0.2;
              },
              vLineWidth: function () {
                return 0.2;
              },
              hLineColor: function () {
                return '#00267A';
              },
              vLineColor: function () {
                return '#00267A';
              },
            },
          },
        ],
      },
    ],
    styles: {
      header: {
        fontSize: 9,
        bold: true,
        color: '#00267A',
        margin: [0, 0, 0, 10],
      },
      header2: {
        fontSize: 6.5,
        bold: true,
        color: '#00267A',
        //margin: ['auto', 5]
      },
      text: {
        fontSize: 5,
        color: '#00267A',
      },
      label: {
        fontSize: 6,
        color: '#00267A',
        bold: true,
      },
      value: {
        fontSize: 6,
        color: '#00267A',
      },
      name: {
        fontSize: 7,
        color: '#00267A',
      },
      subname: {
        fontSize: 9,
        color: '#00267A',
        bold: true,
      },
      subname2: {
        fontSize: 8,
        color: '#00267A',
        bold: false,
      },
      tableExample: {
        margin: [0, 5, 0, 15],
      },
      tableHeader: {
        bold: true,
        fontSize: 13,
        color: 'black',
      },
    },
    defaultStyle: {
      // alignment: 'justify'
    },
  };
}
