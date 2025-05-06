import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as powerbi from 'powerbi-client';
import { models } from 'powerbi-client';

@Component({
  selector: 'app-report',  // Mise à jour du sélecteur
  templateUrl: './report.component.html',  // Mise à jour du template
  styleUrls: ['./report.component.css']  // Mise à jour du style
})
export class ReportComponent implements OnInit {  // Mise à jour du nom de classe
  @ViewChild('reportContainer', { static: true }) reportContainer!: ElementRef;

  constructor() {}

  ngOnInit(): void {
    const embedConfig = {
      type: 'report',
      id: 'TON_REPORT_ID',
      embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=fac83348-b8d7-4955-a779-fb42378aa90a&autoAuth=true&ctid=604f1a96-cbe8-43f8-abbf-f8eaf5d85730',
      accessToken: 'TON_ACCESS_TOKEN', // Obtenu via Azure AD ou service d'authentification
      tokenType: models.TokenType.Embed,
      settings: {
        panes: {
          filters: { visible: false },
          pageNavigation: { visible: true }
        }
      }
    };

    const powerbiService = new powerbi.service.Service(powerbi.factories.hpmFactory, powerbi.factories.wpmpFactory, powerbi.factories.routerFactory);
    powerbiService.embed(this.reportContainer.nativeElement, embedConfig);
  }
}