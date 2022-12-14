<template>
 <CCard class="sponsored-by-card">
   <CCardBody class="sponsored-by-card-body">
     <CCardText class="card-title">MONTHLY TOURNAMENT SPONSORED BY</CCardText>
     <CCardImage class="card-img" :src="sponsorLogo" />
     <div class="offer">
       <span class="offer-title">Welcome package</span>
       <span class="up-to">Up to </span>
       <span class="up-to">€ 1300 + 250 Free Spins</span>
     </div>
     <button class="s-btn">Sign up</button>
   </CCardBody>
 </CCard>
</template>

<script setup>
import { CCard, CCardBody, CCardImage, CCardText  } from '@coreui/vue';
import sponsorLogo from '../assets/images/sponsored-by-logo.svg';

</script>

<style lang="scss">
@import '../assets/scss/utils/vars';
.sponsored-by-card {
  width: 32%;
  height: 232px;
  background: #5D53C2;
  border-radius: 8px;

  @media screen and (max-width: $phoneWidth){
    width: 50%;
    margin-bottom: 10px;
  }

  .sponsored-by-card-body {
    padding: 12px 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    .card-title {
      font-family: 'Poppins', sans-serif;
      font-style: normal;
      font-weight: 600;
      font-size: 12px;
      line-height: 17px;
      text-align: center;
      letter-spacing: 0.2px;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.8);
    }

    .card-img {
      width: 115px;
      height: 61px;
    }

    .offer {
      display: flex;
      flex-direction: column;
      font-family: 'Poppins', sans-serif;
      font-style: normal;

      .offer-title {
        font-weight: 600;
        font-size: 13px;
        line-height: 20px;
        text-align: center;
        letter-spacing: 0.3px;
        text-transform: uppercase;
        color: #F38F1F;
        @media screen and (max-width: $phoneWidth){
          font-size: 12px;
          line-height: 14px;
        }
      }
      .up-to {
        font-weight: 500;
        font-size: 13px;
        line-height: 20px;
        text-align: center;
        letter-spacing: 0.3px;
        text-transform: uppercase;
        color: #FFFFFF;

        @media screen and (max-width: $phoneWidth){
          font-size: 10px;
          line-height: 14px;
        }
      }
    }
  }
}
</style>