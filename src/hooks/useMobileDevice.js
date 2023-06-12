import { ref, onMounted, onUnmounted } from 'vue'

export default function useMobileDevice() {
    const isMobile = ref(false)

    const checkIsMobileDevice = () => {
        isMobile.value = window.innerWidth <= 820
    }

    onMounted(() => {
        window.addEventListener('resize', checkIsMobileDevice)
        checkIsMobileDevice()
    })

    onUnmounted(() => {
        window.removeEventListener('resize', checkIsMobileDevice)
    })

    return {
        isMobile
    }
}