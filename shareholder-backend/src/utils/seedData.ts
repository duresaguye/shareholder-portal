import { ShareClassType } from "@prisma/client";
import { prisma } from "../prismaClient";

export async function seedShareClasses() {
  try {
    // Check if share classes already exist
    const existingClasses = await prisma.shareClass.findMany();
    
    if (existingClasses.length > 0) {
      console.log("Share classes already exist, skipping seed");
      return;
    }

    // Create default share classes
    const shareClasses = [
      {
        name: ShareClassType.COMMON,
        description: "Common shares with voting rights"
      },
      {
        name: ShareClassType.PREFERRED,
        description: "Preferred shares with priority dividends"
      },
      {
        name: ShareClassType.OPTIONS_POOL,
        description: "Employee stock option pool"
      },
      {
        name: ShareClassType.TREASURY,
        description: "Treasury shares held by the company"
      }
    ];

    for (const shareClass of shareClasses) {
      await prisma.shareClass.create({
        data: shareClass
      });
    }

    console.log("Share classes seeded successfully");
  } catch (error) {
    console.error("Error seeding share classes:", error);
  }
}

// Run seed if this file is executed directly
if (require.main === module) {
  seedShareClasses()
    .then(() => {
      console.log("Seeding completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seeding failed:", error);
      process.exit(1);
    });
}