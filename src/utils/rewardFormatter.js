export const rewardFormatter = (reward) => {
  let defaultRewardValue = Number.isInteger(reward.rewardValue) ? reward.rewardValue : reward.rewardValue.toFixed(6);

  if (typeof reward.unitOfMeasure !== 'undefined' && typeof reward.unitOfMeasure.symbol !== 'undefined' && reward.unitOfMeasure.symbol !== null) {
    defaultRewardValue = reward.unitOfMeasure.symbol + reward.value;
  }

  return defaultRewardValue;
}