export interface IState {
  _id: string;
  name: string;
  email: string;
  jwt: string;
}

export const intial_state: IState = {
  _id: '',
  name: 'Guest',
  email: '',
  jwt: '',
};
