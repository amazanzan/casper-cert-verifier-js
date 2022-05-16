import chainsService from '../../chains';
import getParentVerificationSteps, { VerificationSteps, SUB_STEPS } from '../../../constants/verificationSteps'; // TODO: circular dependency
import type { IBlockchainObject } from '../../../constants/blockchains';
import domain from '../../index';
import type VerificationSubstep from '../../verifier/valueObjects/VerificationSubstep';

export interface IVerificationMapItem {
  code: VerificationSteps;
  label: string;
  labelPending: string;
  subSteps: VerificationSubstep[];
}

function removeStep (map: string[], step: string): void {
  const stepIndex = map.findIndex(subStep => subStep === step);
  if (stepIndex > -1) {
    map.splice(stepIndex, 1);
  }
}

export function getVerificationStepsForCurrentCase (chain: IBlockchainObject, hasDid: boolean): SUB_STEPS[] {
  const verificationSteps = Object.values(SUB_STEPS);

  if (chainsService.isMockChain(chain)) {
    removeStep(verificationSteps, SUB_STEPS.checkRevokedStatus);
  }

  if (!hasDid) {
    removeStep(verificationSteps, SUB_STEPS.controlVerificationMethod);
  }

  return verificationSteps;
}

const verificationMap = {
  [VerificationSteps.formatValidation]: [
    SUB_STEPS.checkImagesIntegrity
  ],
  [VerificationSteps.proofVerification]: [],
  [VerificationSteps.identityVerification]: [
    SUB_STEPS.controlVerificationMethod
  ],
  [VerificationSteps.statusCheck]: [
    SUB_STEPS.checkRevokedStatus,
    SUB_STEPS.checkExpiresDate
  ]
};

function filterSubStepsForParentStep (parentStepKey: VerificationSteps, substepsList: SUB_STEPS[]): VerificationSubstep[] {
  const childSteps: SUB_STEPS[] = verificationMap[parentStepKey];
  const filteredChildSteps: SUB_STEPS[] = childSteps.filter(childStep => substepsList.includes(childStep));

  return filteredChildSteps.map(childStepKey =>
    domain.verifier.convertToVerificationSubsteps(parentStepKey, childStepKey)
  );
}

function getFullStepsWithSubSteps (verificationSubStepsList: SUB_STEPS[]): IVerificationMapItem[] {
  const steps = getParentVerificationSteps();
  return Object.keys(steps)
    .map(parentStepKey => ({
      ...steps[parentStepKey],
      subSteps: filterSubStepsForParentStep((parentStepKey as VerificationSteps), verificationSubStepsList)
    }));
}

export default function getVerificationMap (chain: IBlockchainObject, hasDid: boolean = false): {
  verificationMap: IVerificationMapItem[];
  verificationProcess: SUB_STEPS[];
} {
  const verificationProcess: SUB_STEPS[] = getVerificationStepsForCurrentCase(chain, hasDid);
  return {
    verificationProcess,
    verificationMap: getFullStepsWithSubSteps(verificationProcess)
  };
}
