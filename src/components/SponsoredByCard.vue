<template>
 <CCard class="sponsored-by-card">
   <CCardBody class="sponsored-by-card-body">
     <CCardText class="card-title">MONTHLY TOURNAMENT SPONSORED BY</CCardText>
     <CCardImage :src="$options.sponsorLogo" />
     <div class="offer">
       <span>Welcome package</span>
       <span>Up to </span>
       <span>€ 1300 + 250 Free Spins</span>
     </div>
     <CButton>Sign up</CButton>
   </CCardBody>
 </CCard>
</template>

<script>
import { CCard, CCardBody, CButton, CCardImage, CCardText  } from '@coreui/vue';
import sponsorLogo from '../assets/images/sponsored-by-logo.svg';

export default {
  name: 'SponsoredByCard',
  sponsorLogo,
  components: {
    CCardImage,
    CCardText,
    CCard,
    CCardBody,
    CButton
  }
};
</script>

<style lang="scss">
.sponsored-by-card {
  width: 180px;
  height: 232px;
  background: #5D53C2;
  border-radius: 8px;
  .sponsored-by-card-body {
    padding: 12px 0;

    .card-title {
      font-family: 'Poppins';
      font-style: normal;
      font-weight: 600;
      font-size: 12px;
      line-height: 17px;
      text-align: center;
      letter-spacing: 0.2px;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.8);
    }
  }
}
</style>