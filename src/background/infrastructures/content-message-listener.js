import messages from '../../shared/messages';
import CompletionsController from '../controllers/completions';
import SettingController from '../controllers/setting';

export default class ContentMessageListener {
  constructor() {
    this.settingController = new SettingController();
    this.completionsController = new CompletionsController();
  }

  run() {
    browser.runtime.onMessage.addListener((message, sender) => {
      try {
        return this.onMessage(message, sender);
      } catch (e) {
        return browser.tabs.sendMessage(sender.tab.id, {
          type: messages.CONSOLE_SHOW_ERROR,
          text: e.message,
        });
      }
    });
  }

  onMessage(message) {
    switch (message.type) {
    case messages.CONSOLE_QUERY_COMPLETIONS:
      return this.onConsoleQueryCompletions(message.text);
    case messages.SETTINGS_QUERY:
      return this.onSettingsQuery();
    case messages.SETTINGS_RELOAD:
      return this.onSettingsReload();
    }
  }

  async onConsoleQueryCompletions(line) {
    let completions = await this.completionsController.getCompletions(line);
    return Promise.resolve(completions.serialize());
  }

  onSettingsQuery() {
    return this.settingController.getSetting();
  }

  onSettingsReload() {
    return this.settingController.reload();
  }
}
