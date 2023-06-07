import { ref, onMounted, onUnmounted } from 'vue'

export default function useMobileDevice() {
    const isMobile = ref(false)

    const checkIsMobileDevice = () => {
        isMobile.value = window.innerWidth <= 768
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