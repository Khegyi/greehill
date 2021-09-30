import { shallow } from "enzyme";
import App from "./App";

describe("App", () => {
  let counter;
  beforeEach(() => {
    counter = shallow(<App />);
  });

  it("renders correctly", () => {
    shallow(<App />);
  });
  it(`should increase the generation counter`, () => {
    expect(counter.find("span[title='gen_counter']").text()).toBe(
      "0th generation"
    );
    const nextBtn = counter.find("button.next");
    nextBtn.simulate("click");
    expect(counter.find("span[title='gen_counter']").text()).toBe(
      "1th generation"
    );
  });
  it(`should set the generation counter to 0`, () => {
    const clearBtn = counter.find("button.clear");
    clearBtn.simulate("click");
    expect(counter.find("span[title='gen_counter']").text()).toBe(
      "0th generation"
    );
  });
  it(`should clear the calculate next Generation`, () => {
    const nextBtn = counter.find("button.next");
    nextBtn.simulate("click");
    expect(counter.find("span[title='gen_counter']").text()).toBe(
      "1th generation"
    );
  });
});
