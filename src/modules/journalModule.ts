import { Getters, Mutations, Actions, Module } from "vuex-smart-module";
import journal from "@/models/journal";

class journalState {
  journalCollection: journal = new journal();
}

class journalGetters extends Getters<journalState> {
  get getDataSet() {
    return this.state.journalCollection.dataSet;
  }
  get getSearchWord() {
    return this.state.journalCollection.searchWord;
  }
  get getFilterdDataSet() {
    return this.state.journalCollection.filterdDataSet;
  }
  get getDailySummary() {
    return this.state.journalCollection.dailySummary;
  }
}

class journalMutations extends Mutations<journalState> {
  atouch(_: any) {
    this.state.journalCollection.atouch();
  }
  detouch(_: any) {
    this.state.journalCollection.detouch();
  }
  setSearchWord(searchWord: string) {
    this.state.journalCollection.searchWord = searchWord;
  }
}

class journalActions extends Actions<
  journalState,
  journalGetters,
  journalMutations,
  journalActions
> {
  atouch() {
    this.commit("atouch", null);
  }
  detouch() {
    this.commit("detouch", null);
  }
  setSearchWord(searchWord: string) {
    this.commit("setSearchWord", searchWord);
  }
}

export const journalModule = new Module({
  state: journalState,
  getters: journalGetters,
  mutations: journalMutations,
  actions: journalActions
});
