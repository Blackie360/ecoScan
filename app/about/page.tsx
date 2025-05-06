import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">About EcoScan</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
            <CardDescription>Promoting sustainable waste management through technology</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              EcoScan was created to help people make better decisions about waste disposal. By leveraging the power of
              Gemini AI, we provide instant identification of waste items and guidance on proper disposal methods. Our
              goal is to reduce landfill waste and increase recycling rates through education and accessible technology.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
            <CardDescription>The technology behind EcoScan</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              EcoScan uses Google&apos;s Gemini AI to analyze images of waste items. When you take a photo or upload an
              image, our application sends it to the Gemini model, which has been trained on thousands of waste items.
              The AI identifies the type of material, determines if it&apos;s recyclable, and provides specific disposal
              instructions and environmental impact information.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Privacy & Data</CardTitle>
            <CardDescription>How we handle your information</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We take your privacy seriously. Images you upload or capture are only used for the purpose of waste
              classification and are not stored permanently. Our application processes the images temporarily to provide
              you with results, after which they are automatically deleted from our servers. We do not collect personal
              information or track your waste disposal habits.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
