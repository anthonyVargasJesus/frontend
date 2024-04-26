import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ErrorManager } from 'app/errors/error-manager';
import { Documentation } from 'app/models/documentation';
import { DocumentationService } from 'app/services/documentation.service';

@Component({
  selector: 'app-edit-documentation-support',
  templateUrl: './edit-documentation-support.component.html',
  styles: [
  ]
})
export class EditDocumentationSupportComponent implements OnInit {

  constructor(
    private documentationService: DocumentationService,
    private route: ActivatedRoute,
    public router: Router,
  ) { }

  documentation: Documentation;
  loading = false;
  id: string;
  loading2 = false;
  public submitted = false;

  public title: string = '';
  public subtitle: string = '';

  standardId: string = '';
  public contentHeader: object;

  ngOnInit(): void {
    this.initMenuName();
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id').toString();
      // this.standardId = params.get('id2').toString();
      this.obtain(this.id);
    });
  }

  initMenuName() {
    this.contentHeader = {
      headerTitle: 'Sustento',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Documentación',
            isLink: false,
            link: '#'
          },
          {
            name: 'Sustento',
            isLink: false
          },
        ]
      }
    }
  }

  obtain(id: string) {
    this.loading = true;
    this.documentationService.obtain(id)
      .subscribe((res: any) => {
        this.documentation = res.data;

        console.log(res);
        
        this.title = this.documentation.name;
        this.subtitle = this.documentation.description;

        this.loading = false;
        this.standardId = this.documentation.standardId.toString();
      }, error => {
        this.loading = false;
        ErrorManager.handleError(error);
      });
  }

  navigateToBack() {
    this.router.navigate(['/supports']);
  }

}
