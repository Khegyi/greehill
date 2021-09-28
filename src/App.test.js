import App from "./App";
import { shallow } from "enzyme";

describe(`App Component`, () => {
  let counter;
  beforeEach(() => {
    counter = shallow(<App />);
  });

  it(`should increase the generation counter`, () => {
    expect(counter.find("p.grid_info").text()).toBe(
      "0th generation | Cells alive:0"
    );
    const nextBtn = counter.find("button.next");
    nextBtn.simulate("click");
    expect(counter.find("p.grid_info").text()).toBe(
      "1th generation | Cells alive:0"
    );
  });
  it(`should set the generation counter to 0`, () => {
    const clearBtn = counter.find("button.clear");
    clearBtn.simulate("click");
    expect(counter.find("p.grid_info").text()).toBe(
      "0th generation | Cells alive:0"
    );
  });
  it(`should clear the calculate next Generation`, () => {
    const nextBtn = counter.find("button.next");
    nextBtn.simulate("click");
    expect(counter.find("p.grid_info").text()).toBe(
      "1th generation | Cells alive:0"
    );
  });
});
