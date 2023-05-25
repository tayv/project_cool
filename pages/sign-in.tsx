import LayoutContainerSide from "@designSystem/layouts/LayoutContainerSide"
import Breadcrumbs from "@designSystem/molecules/Breadcrumbs"
import Heading from "@designSystem/atoms/Heading"
import Paragraph from "@designSystem/atoms/Paragraph"
import CardSection from "@designSystem/molecules/CardSection"
import { SignIn } from "@clerk/nextjs"

// data for Breadcrumbs
const crumbs = [
  {
    text: "Home",
    path: "/",
  },
  {
    text: "Test Document Builder",
    path: "/",
  },
]

const SignInPage = () => (
  <>
    <LayoutContainerSide>
      <Breadcrumbs crumbs={crumbs} />
      <Heading size="h1">Sign In Page</Heading>
      <Paragraph>You need to sign in before viewing this page.</Paragraph>
      <CardSection id="sign-in" style="standard">
        <SignIn />
      </CardSection>
    </LayoutContainerSide>
  </>
)

export default SignInPage

// Set up redirects for Clerk Auth (https://dashboard.clerk.com/) on the dashboard in Develoers > Paths > Sign-In
