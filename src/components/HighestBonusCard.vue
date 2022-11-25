<template>
  <div class="highest-bonus">
    <h2 class="highest-bonus__title">Highest bonus 🤑</h2>
    <div class="highest-bonus__item">
      <div class="highest-bonus__item__logo">IMG</div>
      <h3 class="highest-bonus__item__name">Stay Casino 😝</h3>
      <div class="highest-bonus__item__money">$1550</div>
    </div>
    <div class="highest-bonus__item">
      <div class="highest-bonus__item__logo">IMG</div>
      <h3 class="highest-bonus__item__name">Stay Casino 😝</h3>
      <div class="highest-bonus__item__money">$1550</div>
    </div>
    <div class="highest-bonus__item">
      <div class="highest-bonus__item__logo">IMG</div>
      <h3 class="highest-bonus__item__name">Stay Casino 😝</h3>
      <div class="highest-bonus__item__money">$1550</div>
    </div>
    <div class="highest-bonus__item">
      <div class="highest-bonus__item__logo">IMG</div>
      <h3 class="highest-bonus__item__name">Stay Casino 😝</h3>
      <div class="highest-bonus__item__money">$1550</div>
    </div>
    <div class="highest-bonus__item">
      <div class="highest-bonus__item__logo">IMG</div>
      <h3 class="highest-bonus__item__name">Stay Casino 😝</h3>
      <div class="highest-bonus__item__money">$1550</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HighestBonusCard'
};
</script>

<style lang="scss">
.highest-bonus {
  max-width: 314px;
  display: flex;
  flex-direction: column;

  padding: 25px 15px;

  background: #5951AC;
  border: 2px solid #ABA7D9;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  border-radius: 20px;

  &__title {
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 700;
    font-size: 18px;
    line-height: 27px;
    color: #FFFFFF;
    text-align: start;
  }

  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 10px;

    &__logo {
      width: 80px;
      height: 42px;

      background: #000000;
      border-radius: 10px;
    }

    &__name {
      font-family: 'Poppins';
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 21px;
      color: #FFFBFF;
    }

    &__money {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10px 20px;

      background: #F6876A;
      border-radius: 14px;

      font-family: 'Poppins';
      font-style: normal;
      font-weight: 400;
      font-size: 12px;
      line-height: 18px;
      color: #FFFBFF;
    }
  }
}
</style>