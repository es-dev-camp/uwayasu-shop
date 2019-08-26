import { shallowMount } from "@vue/test-utils";
import { VContainer, VLayout, VFlex, VImg } from "vuetify/lib";
import HelloWorld from "@/components/HelloWorld.vue";

describe("Test HelloWorld.vue message property", () => {
  it("renders props.msg when passed", () => {
    const msg = "test world.";
    const wrapper = shallowMount(HelloWorld, {
      propsData: { msg }
    });
    expect(wrapper.text()).toMatch(msg);
  });
});
