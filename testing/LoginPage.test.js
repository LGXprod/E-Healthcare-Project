test('Should call mock function when clicking NavBar button', () => {
  const openNavSpy = jest.fn();
  const wrapper = shallow(<LoginPage openSignup={openNavSpy} />);
  const p = wrapper.find('i');
  console.log(p.debug());
  p.simulate('click');
  expect(openNavSpy).toHaveBeenCalledTimes(1);
 });
