<template>
  <CCard class="starts-in-card">
    <CCardBody class="starts-in-card-body">
      <CCardImage class="card-icon" :src="gatesOfOlympusIcon" />
      <Countdown
        :date="end"
        :title="'Starts in'"
        :is-row="true"
        :is-x-small-size="true"
        @onFinish="finish()"
      />
      <div class="content-wrapper">
        <CCardImage class="card-image" :src="gatesOfOlympusImg" />
        <div class="content-card">
          <div class="content-title">Gates of Olympus - Free Online Slots Tournament</div>
          <div class="content">
            <div class="card-rows" v-for="row in rows">
              <CRow class="card-row" key="{{row.label}}">
                <CCol class="card-row-label">
                  {{ row.label }}
                </CCol>
                <CCol class="card-row-content">
                  {{ row.content }}
                </CCol>
              </CRow>
            </div>
            <button class="s-btn">Sign up</button>
          </div>
        </div>
      </div>
    </CCardBody>
  </CCard>
</template>

<script setup>
import { CCard, CCardBody, CCardImage, CRow, CCol } from '@coreui/vue';
import gatesOfOlympusImg from '../assets/images/Gates-of-Olympus.png';
import gatesOfOlympusIcon from '../assets/images/Gates-of-Olympus-icon.svg';
import Countdown from './Countdown';

const rows = [
  {label: 'Type', content: 'Total Win'},
  {label: 'Start Time', content: '10.17 05:15 Europe/London'},
  {label: 'End Time', content: '10.17 11:15 Europe/London'},
  {label: 'Spins', content: '250'},
]

const end = new Date('2023-01-01T00:00:00');

const finish = () => {
  console.log('finish');
}

</script>

<style lang="scss">
@import '../assets/scss/utils/vars';
.starts-in-card {
  width: 180px;
  height: 232px;
  background: #5D53C2;
  border-radius: 8px;

  .starts-in-card-body {
    padding: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    .card-icon {
      width: 73px;
      height: 45px;
      border-radius: 14px;
    }

    .content-wrapper {
      position: relative;
      width: 98%;
      height: 168px;
      border-radius: 14px;
      overflow: hidden;

      .card-image {
        width: inherit;
        height: inherit;
      }

      .content-card {
        position: absolute;
        width: 98%;
        height: 149px;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(93, 83, 194, 0.59);
        backdrop-filter: blur(10px);
        border-radius: 14px;

        .content-title {
          display: flex;
          align-items: center;
          height: 30%;
          border-bottom: 0.5px solid rgba(255, 255, 255, 0.3);

          font-family: 'Poppins', sans-serif;
          font-style: normal;
          font-weight: 700;
          font-size: 9px;
          line-height: 13px;
          color: #FCFCFC;
        }
        .content {
          font-family: 'Poppins', sans-serif;
          font-style: normal;
          width: 100%;
          height: 70%;
          background: none;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 12px;

          .card-rows {
            width: 100%;
            .card-row {
              width: 100%;
              padding: 5px 6px 0;
              margin: 0;

              .card-row-label {
                padding: 0;
                flex-grow: 1;
                font-weight: 500;
                font-size: 6px;
                line-height: 9px;
                color: #FFFFFF;
                text-align: start;
              }
              .card-row-content {
                padding: 0;
                flex-grow: 1;
                font-weight: 400;
                font-size: 6px;
                line-height: 9px;
                color: rgba(255, 255, 255, 0.8);
                text-align: end;
              }
            }
          }
        }
      }
    }
  }
}
</style>