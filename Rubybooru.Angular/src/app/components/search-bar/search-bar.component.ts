import { Component, OnInit, ViewChild } from '@angular/core';
import { Tag } from '../../entities/tag';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { UrlParserService } from '../../services/url-parser/url-parser.service';
import { InputWhispererComponent } from '../input-whisperer/input-whisperer.component';
import { InputParser } from './input.parser';
import { TagService } from '../../services/tag-service/tag.service';
import { SizeCondition } from '../../data/size-condition';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.sass']
})
export class SearchBarComponent implements OnInit {

  @ViewChild(InputWhispererComponent) inputWhisperer: InputWhispererComponent;

  public tags: Tag[] = [];
  public defaultValue = '';

  public showConditions = true;

  private idToName: { [key: number]: string } = {};
  private nameToId: { [key: string]: number } = {};
  private urlParser: UrlParserService;
  private sizeConditions: SizeCondition[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private tagService: TagService
  ) {
    this.urlParser = new UrlParserService(router, route);
    this.route.params.subscribe(() => this.onParamChange());
    this.route.queryParams.subscribe(() => this.onParamChange());
  }

  ngOnInit(): void {
    this.tagService.getTags().subscribe(tags => {
      this.updateTags(tags);
    });
  }

  public onSubmit() {
    const parser = new InputParser(this.inputWhisperer.getValues(), this.nameToId);
    this.urlParser.navigate(1, parser.getTags(), this.sizeConditions);
  }

  public addCondition( condition: SizeCondition ) {
    this.sizeConditions.push(condition);
  }

  public removeCondition( condition: SizeCondition ) {
    const index = this.sizeConditions.indexOf(condition, 0);
    if (index > -1) {
      this.sizeConditions.splice(index, 1);
    }
  }

  private onParamChange() {
    const tagIds = this.urlParser.getTags();

    let value = '';
    if (tagIds !== null && Object.keys(this.idToName).length !== 0) {
      for (const id of tagIds) {
        value += this.idToName[id] + ' ';
      }
    }

    this.defaultValue = value;

    const conditions = this.urlParser.getSizeConditions();
    this.sizeConditions = conditions != null ? conditions : [];
  }

  private updateTags( tags: Tag[] ) {
    tags.forEach(t => {
      this.idToName[t.id] = t.name;
      this.nameToId[t.name] = t.id;
    });
    this.tags = tags.filter(t => environment.whispererUsedTags.indexOf(t.type) !== -1);
  }
}
