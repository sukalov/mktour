import { faker } from '@faker-js/faker';

const getMockList = (n: number) =>
  Array(n)
    .fill('')
    .map((_, i) => <div key={i}>{i + '. ' + faker.person.fullName()}</div>);

export default getMockList;
