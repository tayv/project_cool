import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer"

// base schemas
const genericSchemaA = {
  checkboxExample: {
    true: {
      bodyA: "TRUE: Generic schema body A",
      headerB: "TRUE: Generic schema header B",
      bodyB: "TRUE: Generic schema body B",
      listA: ["item a", "item b", "item c"],
    },
    false: {
      bodyA: "FALSE: Generic schema body A",
    },
  },
}

const genericSchemaB = {
  checkboxExample: {
    true: {
      bodyA: "TRUE: Generic schema body A",
    },
    false: {
      bodyA: "FALSE: Generic schema body A",
    },
  },
}

// location specific schemas
const schemaLocationA = {
  radioExample: {
    option1: {
      bodyA: "Schema location A was selected",
    },
    option2: {
      bodyA: "hello",
    },
    option3: {
      headerA: "This is a header",
      bodyA: "This is a body",
      headerB: "This is a second Header",
      bodyB: "Second body text here",
      bodyC: "This is a body",
    },
  },
}

const schemaLocationB = {
  radioExample: {
    option1: {
      bodyA:
        "hello It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
    },
    option2: {
      bodyA: "Schema Location B",
    },
  },
}

// helper functions

// get generic schema
const getGenericSchema = ({ selectedLocation }) => {
  switch (selectedLocation) {
    case "location1":
      return genericSchemaA
    case "location2":
      return genericSchemaB
    default:
      return genericSchemaA
  }
}

// get dynamic schema
const getLocationSchema = ({ selectedLocation }) => {
  switch (selectedLocation) {
    case "location1":
      return schemaLocationA
    case "location2":
      return schemaLocationB
    default:
      return schemaLocationA
  }
}

// export from separate file
export const getSchemas = ({ formData }) => {
  // The schemas are specific to the location so need to be fetched dynamically
  const selectedLocation = formData.jurisdiction
  const locationSchema = getLocationSchema({ selectedLocation })
  const genericSchema = getGenericSchema({ selectedLocation })

  console.log("locationSchema", locationSchema, "genericSchema", genericSchema)

  return { locationSchema, genericSchema } // destructure these and use in the next function. Didn't spread into a single object since the template needs to handle logic from many different locations.
}

// build doc template
// Need to fill the schema with correct formData values
// Create PDF styles
const testStyles = StyleSheet.create({
  h1: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
})
// set PDF component type
const setPDFSectionType = ({ section }) => {
  switch (section.type) {
    case "header":
      return <Text style={testStyles.h1}>{section.value}</Text>
    case "body":
      return <Text>{section.value}</Text>
    case "list":
      return section.value.map((item, index) => {
        return (
          <Text key={index} style={{ textIndent: "10px" }}>
            - {item}
          </Text>
        )
      })
    default:
      return genericSchemaA
  }
}

export const fillDocTemplate = ({ docTemplate }) => {
  // Map through the docTemplate
  return docTemplate.map((section) => {
    // get the location array inside each section
    const sectionLocationArray = section.location

    // Check if sectionLocationArray is defined before calling some
    if (!sectionLocationArray) {
      console.error(
        `Jurisdiction not defined for section: ${JSON.stringify(section)}`
      )
      return "Jurisdiction not defined"
    }
    console.log("TEST SECTION:", section)
    // get location array so we can see if at least one location matches
    const hasCorrectLocation = sectionLocationArray.some(
      (location) => location === "all" || location === "location2"
    )
    // and only return section values that match the location
    if (hasCorrectLocation) {
      // TO DO: Need to generate the correct PDF component based on the type property

      return setPDFSectionType({ section }) // This could potentially just be a condition to render a style. Need to figure out how to handle lists though
    } else {
      return <Text>Failed</Text>
    }
  })
}

// render final doc
const buildFinalDoc = (formData) => {
  // get schemas
  const { locationSchema, genericSchema } = getSchemas({ formData })

  // set up doc template
  const docTemplate = [
    {
      location: ["all"],
      type: "header",
      value: genericSchema.checkboxExample.true.bodyA,
    },
    {
      location: ["location1", "location2"],
      type: "body",
      value: locationSchema.radioExample.option2.bodyA,
    },
    {
      location: ["all"],
      type: "list",
      value: genericSchema.checkboxExample.true.listA,
    },
  ]

  const testDocResult = fillDocTemplate({ docTemplate })
  return testDocResult
  //return alert(JSON.stringify(testDocResult))
}

export default buildFinalDoc
