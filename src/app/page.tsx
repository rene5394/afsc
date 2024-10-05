import Header from '@/app/components/Header/Header'
import WelcomeSection from '@/app/components/Home/WelcomeSection'
import Footer from '@/app/components/Footer/Footer'
import Container from '@/app/components/Home/Container'

export default async function Home() {
  return (
    <>
      <Header showBottomBorder={false} />
      <WelcomeSection />
      <Container />
      <Footer />
    </>
  )
}
