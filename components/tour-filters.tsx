import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function TourFilters() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-4">Price Range</h3>
        <div className="px-2">
          <Slider defaultValue={[0, 500]} min={0} max={1000} step={10} />
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-muted-foreground">$0</span>
            <span className="text-sm text-muted-foreground">$1000+</span>
          </div>
        </div>
      </div>

      <Accordion type="multiple" defaultValue={["categories", "duration", "features"]}>
        <AccordionItem value="categories">
          <AccordionTrigger>Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="diving" />
                <label htmlFor="diving" className="text-sm">
                  Diving & Snorkeling
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="desert" />
                <label htmlFor="desert" className="text-sm">
                  Desert Safaris
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="boat" />
                <label htmlFor="boat" className="text-sm">
                  Boat Trips
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="historical" />
                <label htmlFor="historical" className="text-sm">
                  Historical Tours
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="water" />
                <label htmlFor="water" className="text-sm">
                  Water Sports
                </label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="duration">
          <AccordionTrigger>Duration</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="hours-0-3" />
                <label htmlFor="hours-0-3" className="text-sm">
                  0-3 hours
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="hours-3-5" />
                <label htmlFor="hours-3-5" className="text-sm">
                  3-5 hours
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="hours-5-7" />
                <label htmlFor="hours-5-7" className="text-sm">
                  5-7 hours
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="full-day" />
                <label htmlFor="full-day" className="text-sm">
                  Full day
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="multi-day" />
                <label htmlFor="multi-day" className="text-sm">
                  Multi-day
                </label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="features">
          <AccordionTrigger>Features</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="free-cancellation" />
                <label htmlFor="free-cancellation" className="text-sm">
                  Free cancellation
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="private-tour" />
                <label htmlFor="private-tour" className="text-sm">
                  Private tour
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="skip-line" />
                <label htmlFor="skip-line" className="text-sm">
                  Skip-the-line
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="hotel-pickup" />
                <label htmlFor="hotel-pickup" className="text-sm">
                  Hotel pickup
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="meals-included" />
                <label htmlFor="meals-included" className="text-sm">
                  Meals included
                </label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="languages">
          <AccordionTrigger>Languages</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="english" />
                <label htmlFor="english" className="text-sm">
                  English
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="arabic" />
                <label htmlFor="arabic" className="text-sm">
                  Arabic
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="russian" />
                <label htmlFor="russian" className="text-sm">
                  Russian
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="german" />
                <label htmlFor="german" className="text-sm">
                  German
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="french" />
                <label htmlFor="french" className="text-sm">
                  French
                </label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

