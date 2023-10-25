import { v4 as uuidv4 } from "uuid";
import { reactive } from "vue";
export class Notifier {
  stickies = new Array<Notification>();
  notifications = new Array<Notification>();
  flashMessages = new Array<Notification>();

  async info(message: string, args?: Record<string, unknown>) {
    // TODO: get rid of uuids after migrating to vue3
    this.notifications.push(new Notification(uuidv4(), message, args));
    await this.wait(4000);
    this.notifications.pop();
  }

  sticky(
    message: string,
    args?: {},
    onClick?: () => void,
    onDismiss?: () => void
  ) {
    const id = uuidv4();
    const onDismissDefault = () => {
      this.stickies = this.stickies.filter((n) => n.id !== id);
    };
    const notification = new Notification(
      id,
      message,
      args,
      onClick,
      onDismiss ?? onDismissDefault
    );

    this.stickies.push(notification);
  }

  async flash(message: string) {
    this.flashMessages.push(new Notification(uuidv4(), message));

    await this.wait(3000);
    this.flashMessages.pop();
  }

  wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export class Notification {
  id: string;
  text: string;
  args: {};
  onClick?: () => void;
  onDismiss?: () => void;
  constructor(
    id: string,
    text: string,
    args?: {},
    onClick?: () => void,
    onDismiss?: () => void
  ) {
    this.id = id;
    this.text = text;
    this.args = args || {};
    this.onClick = onClick;
    this.onDismiss = onDismiss;
  }
}

// it's not cool that something in the model/ package depends on vue directly.
// however, it seems that vue3's new explicit reactivity implementation behaves
// differently to vue2, forcing us to make this a reactive reference in order
// to be able to track changes within our vue components
export const notifier = reactive(new Notifier());
