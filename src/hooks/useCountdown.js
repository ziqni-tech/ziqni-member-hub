import { ref, onMounted, onBeforeUnmount } from 'vue';

export const useCountdown = (targetDate, isWithoutDayAndSeconds) => {
  const targetTime = new Date(targetDate).getTime();
  const remainingTime = ref('');

  const updateCountdown = () => {
    const currentTime = new Date().getTime();
    const timeDifference = targetTime - currentTime;

    if (timeDifference <= 0) {
      clearInterval(countdownInterval);
      remainingTime.value = 'expired';
    } else {
      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

      isWithoutDayAndSeconds
        ? remainingTime.value = `${ hours }h ${ minutes }m`
        : remainingTime.value = `${ days }d ${ hours }h ${ minutes }m ${ seconds }s`;
    }
  };

  const countdownInterval = setInterval(updateCountdown, 1000);

  onMounted(updateCountdown);
  onBeforeUnmount(() => {
    clearInterval(countdownInterval);
  });

  return remainingTime;
};


