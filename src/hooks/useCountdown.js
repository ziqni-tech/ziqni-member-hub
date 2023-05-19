import { onMounted, onBeforeUnmount, reactive } from 'vue';

export const useCountdown = (targetDate) => {
  const targetTime = new Date(targetDate).getTime();
  const remainingTimeObj = reactive({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: ''
  });
  console.warn('targetDate', targetDate);
  const updateCountdown = () => {
    const currentTime = new Date().getTime();
    const timeDifference = targetTime - currentTime;

    if (timeDifference <= 0) {
      clearInterval(countdownInterval);
      remainingTimeObj.expired = 'expired';
    } else {
      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

      remainingTimeObj.days = days;
      remainingTimeObj.hours = hours;
      remainingTimeObj.minutes = minutes;
      remainingTimeObj.seconds = seconds;
    }
  };

  const countdownInterval = setInterval(updateCountdown, 1000);

  onMounted(updateCountdown);
  onBeforeUnmount(() => {
    clearInterval(countdownInterval);
  });
  console.warn('remainingTimeObj', remainingTimeObj);
  return remainingTimeObj;
};


