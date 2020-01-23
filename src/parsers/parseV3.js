import { Decoder } from '@vaultie/lds-merkle-proof-2019';
import { CERTIFICATE_VERSIONS } from '../constants';

function parseSignature (signature) {
  const base58Decoder = new Decoder(signature.proofValue);
  return base58Decoder.decode();
}

export default function parseV3 (certificateJson) {
  const receipt = parseSignature(certificateJson.signature);
  const { issuer } = certificateJson;
  return {
    version: CERTIFICATE_VERSIONS.V3_0_alpha,
    receipt,
    issuer
  };
}
