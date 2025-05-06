import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function GuidePage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Waste Disposal Guide</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Plastic</CardTitle>
            <CardDescription>How to properly dispose of plastic waste</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Plastic waste is one of the most common types of waste and also one of the most problematic for the
              environment. Different types of plastic require different recycling methods.
            </p>

            <Separator />

            <div>
              <h3 className="font-medium mb-2">Common Plastic Types:</h3>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>
                  <strong>PET (1)</strong>: Water bottles, soda bottles - Widely recyclable
                </li>
                <li>
                  <strong>HDPE (2)</strong>: Milk jugs, detergent bottles - Widely recyclable
                </li>
                <li>
                  <strong>PVC (3)</strong>: Pipes, window frames - Limited recyclability
                </li>
                <li>
                  <strong>LDPE (4)</strong>: Plastic bags, squeeze bottles - Check local programs
                </li>
                <li>
                  <strong>PP (5)</strong>: Yogurt containers, bottle caps - Increasingly recyclable
                </li>
                <li>
                  <strong>PS (6)</strong>: Styrofoam, disposable cutlery - Rarely recyclable
                </li>
                <li>
                  <strong>Other (7)</strong>: Mixed plastics - Usually not recyclable
                </li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-2">Disposal Tips:</h3>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Rinse containers before recycling to remove food residue</li>
                <li>Remove caps and lids (these can often be recycled separately)</li>
                <li>Flatten bottles to save space in recycling bins</li>
                <li>Check the recycling number on the bottom of plastic items</li>
                <li>Avoid putting plastic bags in regular recycling (take to store drop-off points)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Paper & Cardboard</CardTitle>
            <CardDescription>How to properly dispose of paper waste</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Paper and cardboard are among the most recyclable materials, with high recovery rates in many regions.
              Proper recycling of paper products saves trees and reduces energy consumption.
            </p>

            <Separator />

            <div>
              <h3 className="font-medium mb-2">Recyclable Paper Items:</h3>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Newspapers, magazines, and catalogs</li>
                <li>Office paper, envelopes, and junk mail</li>
                <li>Cardboard boxes and packaging</li>
                <li>Paper bags and wrapping paper (non-metallic)</li>
                <li>Paperboard (cereal boxes, shoe boxes)</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-2">Non-Recyclable Paper Items:</h3>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Paper towels, napkins, and tissues</li>
                <li>Waxed or plastic-coated paper</li>
                <li>Paper contaminated with food or grease</li>
                <li>Thermal receipt paper</li>
                <li>Metallic wrapping paper</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Electronic Waste</CardTitle>
            <CardDescription>How to properly dispose of electronic waste</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Electronic waste (e-waste) contains valuable materials that can be recovered, as well as hazardous
              components that require special handling. Never dispose of electronics in regular trash.
            </p>

            <Separator />

            <div>
              <h3 className="font-medium mb-2">Common E-Waste Items:</h3>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Computers, laptops, and tablets</li>
                <li>Mobile phones and accessories</li>
                <li>Televisions and monitors</li>
                <li>Printers and scanners</li>
                <li>Small household appliances</li>
                <li>Batteries and power cords</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-2">Disposal Options:</h3>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Manufacturer take-back programs</li>
                <li>Electronics retailer recycling programs</li>
                <li>Local e-waste collection events</li>
                <li>Certified e-waste recycling facilities</li>
                <li>Donation to charities (for working electronics)</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
