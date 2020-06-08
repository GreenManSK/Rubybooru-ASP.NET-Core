import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Tag } from '../../entities/tag';
import { WhispererTag } from './whisperer.tag';
import { TagService } from '../../services/tag-service/tag.service';

@Component({
  selector: 'app-input-whisperer',
  templateUrl: './input-whisperer.component.html',
  styleUrls: ['./input-whisperer.component.sass']
})
export class InputWhispererComponent {

  private static FOCUS_OUT_TIMER = 150;

  @ViewChild('input') inputElement: ElementRef;

  @Input() id = '';
  @Input() name = '';
  @Input() placeholder = '';
  @Input() whisperLimit = environment.whispererTagLimit;

  public TagService = TagService;
  public whisperer = [];
  public activeIndex = -1;

  private tags: WhispererTag[] = [];
  private focusTimer = 0;

  constructor() {
  }

  @Input()
  set items( items: Tag[] ) {
    this.tags = TagService.sortTags(items).map(i => new WhispererTag(i));
  }

  @Input()
  set defaultValue( value: string ) {
    if (this.inputElement != null) {
      this.inputElement.nativeElement.value = value;
    }
  }

  public getValues(): string[] {
    return this.splitValues(this.inputElement.nativeElement.value);
  }

  public valueChange( value: string ): void {
    let usedItems = this.splitValues(value);
    usedItems = usedItems.map(i => i.toLocaleLowerCase());
    const prefix = usedItems[usedItems.length - 1];
    const newWhisperItems = [];
    if (prefix.length > 0) {
      for (const item of this.tags) {
        if (item.match(prefix) && usedItems.indexOf(item.tag.name) === -1) {
          newWhisperItems.push(item.tag);
        }
        if (newWhisperItems.length === this.whisperLimit) {
          break;
        }
      }
    }
    this.setWhispererItems(newWhisperItems);
  }

  public focusIn(): void {
    clearTimeout(this.focusTimer);
  }

  public focusOut(): void {
    this.focusTimer = setTimeout(() => this.whisperer = [], InputWhispererComponent.FOCUS_OUT_TIMER);
  }

  public moveActive( event: Event, delta: number ): void {
    event.preventDefault();
    this.activeIndex += delta;
    this.activeIndex %= this.whisperer.length;
  }

  public addIndexValue( event: Event ): boolean {
    if (this.activeIndex === -1) {
      return true;
    }
    event.preventDefault();
    this.addValue(this.whisperer[this.activeIndex].name);
    return false;
  }

  public addValue( item: string ): void {
    const usedItems = this.splitValues(this.inputElement.nativeElement.value);
    usedItems.pop();
    usedItems.push(item);
    this.inputElement.nativeElement.value = usedItems.join(' ') + ' ';
    this.setWhispererItems([]);
    this.inputElement.nativeElement.focus();
  }

  private setWhispererItems( items: string[] ): void {
    let matching = this.whisperer.length === items.length;
    if (matching) {
      for (let i = 0; i < items.length; i++) {
        if (items[i] !== this.whisperer[i]) {
          matching = false;
          break;
        }
      }
    }
    if (matching) {
      return;
    }
    this.whisperer = items;
    this.activeIndex = -1;
  }

  private splitValues( values: string ): string[] {
    return values.split(/ +/);
  }
}
