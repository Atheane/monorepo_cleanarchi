export default {
  message: {
    account: {
      uid: 'gt6Rg2Et5',
      bid: 1234,
      iban: 'FR6312869000020PC0000023D91',
      bic: 'SMOEFRP1',
    },
    user: {
      profile: {
        address: {
          street: '22 RUE DU PETIT NOYER',
          city: 'AULNAY SOUS BOIS',
          zip_code: '93600',
          country: 'FR',
        },
        birth_name: 'Gotrois',
        first_name: 'Samy',
      },
    },
    bank_details: {
      bank_code: '12869',
      branch_code: '00002',
      account_number: '0PC0000023D',
      check_digits: '91',
    },
  },
  /* eslint-disable max-len */
  success: {
    recipient: undefined,
    subject: undefined,
    path: 'bis/gt6Rg2Et5/1234.pdf',
    content: `<html charset>
  <head>
    <meta charset="UTF-8">
    <style type="text/css">
      @page {
      margin: 0;
      }

      @media print {
       html, body {
         width: 210mm;
         height: 297mm;
       }
       hr{
         display: block
       }
      }

      body{
        background: white;
        font-family: arial, san-serif;
        padding: 0;
        margin: 0 auto;
      }

      hr{
        height: 0mm;
        background:transparent;
        display: block;
        border:0;
        border-top: solid 1.4mm #F2F2F7;
        margin: 0 0 1mm 0;
      }

      .rib-container{
        padding: 18mm 21mm 0 21mm;
        color: #282828;
      }

      .rib-address-container{
        margin-bottom: 6mm;
      }

      .rib-header{
        margin-bottom: 11mm;
      }

      .rib-header, .rib-address-container{
        text-align: left;
      }

      .rib-header::after, .rib-address-container::after{
        content: '';
        display: table;
        clear: both;
        float: none;
      }

      .header-col-left{
        width: 107mm;
        float: left;
      }

      .header-col-right{
        width: 61mm;
        float: right;
      }

      .domiciliation-title-col-right{
        width: 61mm;
        float: right;
      }

      h1.titre-rib{
        font-size: 7mm;
        line-height: 7.1mm;
        margin: 0;
        padding: 0;
      }

      .label{
        font-size: 3.53mm;
        line-height: 4.5mm;
        color: #282828;
        text-transform: uppercase;
        padding: 0;
        margin:0 0 1mm 0;
      }

      .value{
        font-size: 3.8mm;
        line-height: 6mm;
        font-weight: 600;
        padding: 0;
        margin: 0;
      }

      .value.iban-value{
        text-transform: uppercase;
      }

      .footnote{
        color: #898A8D;
        font-size: 3mm;
        width: 80%;
      }

      .rib-info{
        padding: 0 4mm;
      }

      .rib-info hr{
        border-top: solid 0.71mm #F2F2F7;
        margin: 3mm 0;
      }

      hr.last-child{
        margin-bottom: 4mm;
      }

      .rib-info ul{
        padding: 0;
        margin: 0 auto;
        display: block;
        text-align: center;
      }

      .rib-info li{
        padding: 2.47mm 0;
        display: inline-block;
      }

      .rib-info ul.liste-2-col li{
        width: 49%;

      }

      .rib-info ul.liste-4-col li{
        width: 24%;
      }


      .rib-divider-wraper{
          position: relative;
          margin: 11mm auto;
          height: 0;
          width: 100%
      }

      .dashed-line, .rib-divider-wraper svg{
        position: absolute;
        top: 0;
        right: 0;
      }

      .rib-divider-wraper svg{
        margin-top:-3.885mm;
      }

      .dashed-line{
        border-bottom: 0.35mm dashed #282828;
        height: 0;
        width: 100%;
      }


    </style>

  </head>
  <body>
    <!--début du bloc RIB à dupliquer-->
    <div class="rib-container">
      <div class="rib-header">
        <h1 class="header-col-left titre-rib">
          Relevé d’identité<br/>bancaire
        </h1>
        <div class="header-col-right logo-oney-cont">
          <svg width="31.06mm" height="9.88mm" viewBox="0 0 88 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M21.9022 10.8889C21.9022 4.6667 17.2089 0 10.9511 0C4.69337 0 0 4.6667 0 10.8889C0 17.1111 4.69337 21.7778 10.9511 21.7778C17.2089 21.7778 21.9022 17.1111 21.9022 10.8889ZM10.8138 18.1431C14.9412 18.1431 18.2431 15.032 18.2431 10.7543C18.2431 6.47648 14.9412 3.36538 10.8138 3.36538C6.6865 3.36538 3.38461 6.86541 3.38461 10.7543C3.38461 15.032 6.6865 18.1431 10.8138 18.1431Z" fill="#89B915"/>

            <path d="M79.7867 20.2223L88 0H83.6978L77.44 15.1667L71.1823 0H66.8801L75.4845 20.2222L72.3556 28H76.6578L77.8312 25.2778L79.7867 20.2223Z" fill="#89B915"/>

            <path fill-rule="evenodd" clip-rule="evenodd" d="M67.271 12.4445V10.5001C67.271 4.66674 62.5777 0.000148349 56.7111 0.000148349C50.8445 0.000148349 46.1511 4.66685 46.1511 10.8891C46.1511 13.6112 47.3244 16.3335 49.28 18.6669C51.2355 20.6113 53.9733 21.778 56.7111 21.778C59.8399 21.778 64.5333 20.2224 66.4888 15.9446H62.1866C61.0133 17.5002 58.6666 18.2779 56.7111 18.2779C53.9733 18.2779 50.8443 16.7223 50.0622 12.4445H67.271ZM57.1022 3.88902C60.6222 3.88902 62.9689 6.6112 63.7511 8.94455H50.4533C50.8444 6.22238 53.5822 3.88902 57.1022 3.88902Z" fill="#89B915"/>

            <path d="M34.0267 3.50017C30.1156 3.50017 28.16 5.44459 28.16 9.72237V21.7779H24.2489V9.33355C24.2489 7.00019 24.6401 5.4447 25.4223 4.27802C26.5956 2.72242 28.9423 0.000247249 34.0267 0.000247249C39.1111 0.000247249 41.4578 2.72242 42.6311 4.27802C43.4133 5.83363 43.8045 7.38912 43.8045 9.33355V21.7779H39.8934V9.72237C39.8934 5.44459 37.9379 3.50017 34.0267 3.50017Z" fill="#89B915"/>
          </svg>
        </div>
      </div>
      <div class="rib-address-container">
        <div class="domiciliation-title-col-right">
          <p class="label">Domiciliation bancaire</p>
        </div>
      </div>
      <div class="rib-address-container">
        <div class="header-col-left">
          <p class="value">
            <!--DATA : NOM TITULAIRE DU COMPTE-->
            <span>Samy Gotrois</span><br/>
            <!--DATA : ADRESSE TITULAIRE-->
            <span>
              22 Rue Du Petit Noyer<br/>
              93600 Aulnay Sous Bois
            </span>
          </p>
        </div>
        <div class="header-col-right">
          <p class="value">
            Oney Bank<br/>
            34 Avenue de Flandre<br/>
            59170 Croix
          </p>
        </div>
      </div>
      <hr/>
      <div class="rib-info">
        <ul class="liste-2-col">
          <li>
            <p class="label">IBAN</p>
            <!--DATA : IBAN DU COMPTE-->
            <p class="value iban-value">FR6312869000020PC0000023D91</p>
          </li>
          <li>
            <p class="label">BIC</p>
            <!--DATA : BIC DU COMPTE-->
            <p class="value">SMOEFRP1</p>
          </li>
        </ul>
        <hr/>
        <ul class="liste-4-col">
          <li>
            <p class="label">Code Banque</p>
            <!--DATA : code banque-->
            <p class="value">12869</p>
          </li>
          <li>
            <p class="label">Code guichet</p>
            <!--DATA : code guichet-->
            <p class="value">00002</p>
          </li>
          <li>
            <p class="label">Numéro du compte</p>
            <!--DATA : numéro du compte-->
            <p class="value">0PC0000023D</p>
          </li>
          <li>
            <p class="label">Clé RIB</p>
            <!--DATA : clé rib-->
            <p class="value">91</p>
          </li>
        </ul>
      </div>
      <hr class="last-child" />
      <p class="footnote">Oney Bank, Société Anonyme au capital de 51 286 585€ au siège social : 34 avenue de Flandre 59170 CROIX. Immatriculée au Registre du Commerce et des Sociétés de Lille Métropole sous le numéro 546 380 197
      </p>
    </div>
    <!--FIN du bloc RIB à dupliquer-->


    <!--début de la ligne avec les pointillés de découpe-->
    <div class="rib-divider-wraper">
        <div class="dashed-line">

        </div>
        <svg width="8.47mm" height="8.47mm" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="4.23528" cy="4.47113" r="4.05882" fill="white" stroke="#F2F2F7" stroke-width="0.352941"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M5.85233 4.76878C5.9056 4.79491 5.9511 4.82122 5.987 4.84653V4.8465C6.33012 5.08223 6.4552 5.51719 6.26378 5.84874C6.13393 6.07341 5.89038 6.19649 5.63014 6.19649C5.48456 6.19649 5.33351 6.15794 5.19437 6.07738C4.83669 5.87124 4.68068 5.45964 4.8165 5.12181C4.82295 5.11072 4.82659 5.09782 4.82659 5.08409C4.82659 5.05117 4.80641 5.02321 4.77779 5.01163V5.0113L2.11849 3.47617L2.77611 3.29783L4.33804 4.18508L4.77779 3.93096C4.80641 3.91922 4.82659 3.89126 4.82659 3.8585C4.82659 3.8446 4.82295 3.8317 4.8165 3.82061C4.68067 3.48298 4.83669 3.07135 5.19437 2.86505C5.33334 2.78448 5.48455 2.74609 5.63014 2.74609C5.89055 2.74609 6.13408 2.86885 6.26378 3.09352C6.45521 3.42506 6.33012 3.86018 5.987 4.09593C5.9511 4.12124 5.9056 4.14754 5.85233 4.17368C5.84985 4.17501 5.84736 4.17633 5.84488 4.17732C5.7577 4.21935 5.64818 4.26402 5.52773 4.28288C5.29481 4.31944 5.15054 4.34243 5.01488 4.37288L4.84167 4.47115L5.01488 4.56958C5.15053 4.59986 5.29479 4.62286 5.52773 4.65958C5.64818 4.67844 5.7577 4.72328 5.84488 4.76514C5.84525 4.76533 5.84562 4.76553 5.84598 4.76573C5.84806 4.76685 5.85008 4.76793 5.85233 4.76878ZM5.35683 3.14595C5.23871 3.21411 5.15235 3.31751 5.11347 3.43762C5.07856 3.54549 5.08766 3.65402 5.13895 3.74253C5.20578 3.8585 5.33748 3.92782 5.49117 3.92782C5.58481 3.92782 5.67944 3.90168 5.76464 3.85255C5.88277 3.78438 5.96913 3.68098 6.00784 3.56104C6.04292 3.45318 6.03381 3.34481 5.98236 3.2558C5.91553 3.13983 5.78383 3.07067 5.63014 3.07067C5.53634 3.07067 5.4422 3.09681 5.35683 3.14595ZM4.21512 4.4521C4.21512 4.52224 4.2722 4.57916 4.34235 4.57916C4.4125 4.57916 4.46924 4.52241 4.46924 4.4521C4.46924 4.38195 4.41249 4.32504 4.34235 4.32504C4.2722 4.32504 4.21512 4.38195 4.21512 4.4521ZM5.63016 5.87173C5.78385 5.87173 5.91554 5.80274 5.98238 5.6866C6.03383 5.5976 6.04277 5.4894 6.00786 5.38136C5.96914 5.26142 5.88279 5.15802 5.76466 5.09002C5.67946 5.04072 5.58483 5.01458 5.49119 5.01458C5.33749 5.01458 5.2058 5.0839 5.13896 5.19971C5.08784 5.28855 5.07858 5.39692 5.11349 5.50495C5.15237 5.62489 5.23872 5.72846 5.35685 5.79646C5.44205 5.84559 5.53635 5.87173 5.63016 5.87173ZM2.77543 5.64449L2.11781 5.46648L3.51626 4.65895L4.0093 4.94351L2.77543 5.64449Z" fill="black"/>
        </svg>
    </div>
    <!--FIN de la ligne avec les pointillés de découpe-->


    <!--début du bloc RIB à dupliquer-->
    <div class="rib-container">
      <div class="rib-header">
        <h1 class="header-col-left titre-rib">
          Relevé d’identité<br/>bancaire
        </h1>
        <div class="header-col-right logo-oney-cont">
          <svg width="31.06mm" height="9.88mm" viewBox="0 0 88 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M21.9022 10.8889C21.9022 4.6667 17.2089 0 10.9511 0C4.69337 0 0 4.6667 0 10.8889C0 17.1111 4.69337 21.7778 10.9511 21.7778C17.2089 21.7778 21.9022 17.1111 21.9022 10.8889ZM10.8138 18.1431C14.9412 18.1431 18.2431 15.032 18.2431 10.7543C18.2431 6.47648 14.9412 3.36538 10.8138 3.36538C6.6865 3.36538 3.38461 6.86541 3.38461 10.7543C3.38461 15.032 6.6865 18.1431 10.8138 18.1431Z" fill="#89B915"/>

            <path d="M79.7867 20.2223L88 0H83.6978L77.44 15.1667L71.1823 0H66.8801L75.4845 20.2222L72.3556 28H76.6578L77.8312 25.2778L79.7867 20.2223Z" fill="#89B915"/>

            <path fill-rule="evenodd" clip-rule="evenodd" d="M67.271 12.4445V10.5001C67.271 4.66674 62.5777 0.000148349 56.7111 0.000148349C50.8445 0.000148349 46.1511 4.66685 46.1511 10.8891C46.1511 13.6112 47.3244 16.3335 49.28 18.6669C51.2355 20.6113 53.9733 21.778 56.7111 21.778C59.8399 21.778 64.5333 20.2224 66.4888 15.9446H62.1866C61.0133 17.5002 58.6666 18.2779 56.7111 18.2779C53.9733 18.2779 50.8443 16.7223 50.0622 12.4445H67.271ZM57.1022 3.88902C60.6222 3.88902 62.9689 6.6112 63.7511 8.94455H50.4533C50.8444 6.22238 53.5822 3.88902 57.1022 3.88902Z" fill="#89B915"/>

            <path d="M34.0267 3.50017C30.1156 3.50017 28.16 5.44459 28.16 9.72237V21.7779H24.2489V9.33355C24.2489 7.00019 24.6401 5.4447 25.4223 4.27802C26.5956 2.72242 28.9423 0.000247249 34.0267 0.000247249C39.1111 0.000247249 41.4578 2.72242 42.6311 4.27802C43.4133 5.83363 43.8045 7.38912 43.8045 9.33355V21.7779H39.8934V9.72237C39.8934 5.44459 37.9379 3.50017 34.0267 3.50017Z" fill="#89B915"/>
          </svg>
        </div>
      </div>
      <div class="rib-address-container">
        <div class="domiciliation-title-col-right">
          <p class="label">Domiciliation bancaire</p>
        </div>
      </div>
      <div class="rib-address-container">
        <div class="header-col-left">
          <p class="value">
            <!--DATA : NOM TITULAIRE DU COMPTE-->
            <span>Samy Gotrois</span><br/>
            <!--DATA : ADRESSE TITULAIRE-->
            <span>
              22 Rue Du Petit Noyer<br/>
              93600 Aulnay Sous Bois
            </span>
          </p>
        </div>
        <div class="header-col-right">
          <p class="value">
            Oney Bank<br/>
            34 Avenue de Flandre<br/>
            59170 Croix
          </p>
        </div>
      </div>
      <hr/>
      <div class="rib-info">
        <ul class="liste-2-col">
          <li>
            <p class="label">IBAN</p>
            <!--DATA : IBAN DU COMPTE-->
            <p class="value iban-value">FR6312869000020PC0000023D91</p>
          </li>
          <li>
            <p class="label">BIC</p>
            <!--DATA : BIC DU COMPTE-->
            <p class="value">SMOEFRP1</p>
          </li>
        </ul>
        <hr/>
        <ul class="liste-4-col">
          <li>
            <p class="label">Code Banque</p>
            <!--DATA : code banque-->
            <p class="value">12869</p>
          </li>
          <li>
            <p class="label">Code guichet</p>
            <!--DATA : code guichet-->
            <p class="value">00002</p>
          </li>
          <li>
            <p class="label">Numéro du compte</p>
            <!--DATA : numéro du compte-->
            <p class="value">0PC0000023D</p>
          </li>
          <li>
            <p class="label">Clé RIB</p>
            <!--DATA : clé rib-->
            <p class="value">91</p>
          </li>
        </ul>
      </div>
      <hr class="last-child" />
      <p class="footnote">Oney Bank, Société Anonyme au capital de 51 286 585€ au siège social : 34 avenue de Flandre 59170 CROIX. Immatriculée au Registre du Commerce et des Sociétés de Lille Métropole sous le numéro 546 380 197
      </p>
    </div>
    <!--FIN du bloc RIB à dupliquer-->
  </body>
</html>
`,
  },
};
/* eslint-disable max-len */
