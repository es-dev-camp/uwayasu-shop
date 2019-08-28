import { Module, createStore as cs } from "vuex-smart-module";
import { journalModule } from "@/modules/journalModule";

export function createStore() {
  const rootModule = new Module({
    modules: {
      journalModule
    }
  });

  return cs(rootModule);
}
