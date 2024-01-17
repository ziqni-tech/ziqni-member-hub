import { ref, onMounted, onUnmounted } from 'vue'

export default function useMobilePhoneDevice() {
    const isMobilePhone = ref(false)

    const checkIsMobileDevice = () => {
        isMobilePhone.value = window.innerWidth <= 450
    }

    onMounted(() => {
        window.addEventListener('resize', checkIsMobileDevice)
        checkIsMobileDevice()
    })

    onUnmounted(() => {
        window.removeEventListener('resize', checkIsMobileDevice)
    })

    return {
        isMobilePhone
    }
}