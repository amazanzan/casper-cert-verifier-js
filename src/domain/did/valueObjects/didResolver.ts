export const universalResolverUrl = 'https://dev.uniresolver.io/1.0/identifiers';

const DidResolver = {
  value: universalResolverUrl,

  set url (value: string) {
    this.value = value;
  },

  get url (): string {
    return this.value;
  }
};

export default DidResolver;
