import { _decorator, Component, EventHandler, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("EventPeriodChecker")
export class EventPeriodChecker extends Component {
  @property
  private startDate: string = "0000-00-00T00:00:00";

  @property
  private endDate: string = "0000-00-00T00:00:00";

  @property
  private onEnableEvent: boolean = false;

  @property({
    type: EventHandler,
    visible: function () {
      return this.onEnableEvent;
    },
  })
  private events: EventHandler[] = [];

  protected onEnable() {
    if (this.onEnableEvent) {
      for (var e of this.events) {
        e.emit([e.customEventData]);
      }
    }
  }

  public checkInvoke(date: Date) {
    if (!!this.startDate && !!this.endDate) {
      const started = new Date(this.startDate);
      const ended = new Date(this.endDate);

      if (started <= date && date < ended) {
        for (var e of this.events) {
          e.emit([e.customEventData]);
        }
      }
    }
  }

  public check(date: Date) {
    if (!!this.startDate && !!this.endDate) {
      const started = new Date(this.startDate);
      const ended = new Date(this.endDate);

      return started <= date && date < ended;
    }

    return true;
  }
}
