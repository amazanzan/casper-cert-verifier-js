import VerifierError from '../models/verifierError';
import { getText } from '../domain/i18n/useCases';

export default function ensureMerkleRootEqual (merkleRoot: string, remoteHash: string): boolean {
  if (merkleRoot !== remoteHash) {
    throw new VerifierError(
      'checkMerkleRoot',
      getText('errors', 'ensureMerkleRootEqual')
    );
  }

  return true;
}
