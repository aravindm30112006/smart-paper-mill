// ============================================================
//  MOCK DATA — used when running on GitHub Pages (static)
//  Simulates the MongoDB / Express API responses
// ============================================================

export const MOCK_MACHINES = [
    { _id: "m1", machineName: "Fourdrinier Wire PM-1", productionLine: "Line A", status: "Running",   temperature: 72, utilization: 88, operatingHours: 14250 },
    { _id: "m2", machineName: "Kraft Pulper KP-2",     productionLine: "Line A", status: "Running",   temperature: 68, utilization: 76, operatingHours: 9870  },
    { _id: "m3", machineName: "Press Section PS-3",    productionLine: "Line B", status: "Idle",      temperature: 45, utilization: 0,  operatingHours: 6420  },
    { _id: "m4", machineName: "Dryer Cylinder DC-4",   productionLine: "Line B", status: "Running",   temperature: 95, utilization: 92, operatingHours: 18340 },
    { _id: "m5", machineName: "Calender Stack CS-5",   productionLine: "Line C", status: "Maintenance", temperature: 38, utilization: 0, operatingHours: 11020 },
    { _id: "m6", machineName: "Winder Rewinder WR-6",  productionLine: "Line C", status: "Running",   temperature: 55, utilization: 83, operatingHours: 7640  },
    { _id: "m7", machineName: "Chip Conveyor CC-7",    productionLine: "Line A", status: "Offline",   temperature: 22, utilization: 0,  operatingHours: 3210  },
    { _id: "m8", machineName: "Bleach Tower BT-8",     productionLine: "Line B", status: "Running",   temperature: 61, utilization: 71, operatingHours: 5900  },
];

export const MOCK_PRODUCTION = [
    { _id: "p1", batchId: "BATCH-2024-001", paperType: "A4 Bond",       quantity: 12400, productionDate: "2024-10-01", machine: "Fourdrinier Wire PM-1" },
    { _id: "p2", batchId: "BATCH-2024-002", paperType: "Newsprint",     quantity: 9800,  productionDate: "2024-10-03", machine: "Kraft Pulper KP-2"     },
    { _id: "p3", batchId: "BATCH-2024-003", paperType: "Kraft Brown",   quantity: 15600, productionDate: "2024-10-05", machine: "Fourdrinier Wire PM-1" },
    { _id: "p4", batchId: "BATCH-2024-004", paperType: "Tissue Grade",  quantity: 6200,  productionDate: "2024-10-07", machine: "Dryer Cylinder DC-4"   },
    { _id: "p5", batchId: "BATCH-2024-005", paperType: "A4 Bond",       quantity: 11000, productionDate: "2024-10-10", machine: "Winder Rewinder WR-6"  },
    { _id: "p6", batchId: "BATCH-2024-006", paperType: "Coated Art",    quantity: 8500,  productionDate: "2024-10-12", machine: "Calender Stack CS-5"   },
    { _id: "p7", batchId: "BATCH-2024-007", paperType: "Newsprint",     quantity: 13200, productionDate: "2024-10-15", machine: "Kraft Pulper KP-2"     },
    { _id: "p8", batchId: "BATCH-2024-008", paperType: "Kraft Brown",   quantity: 10750, productionDate: "2024-10-17", machine: "Fourdrinier Wire PM-1" },
    { _id: "p9", batchId: "BATCH-2024-009", paperType: "Tissue Grade",  quantity: 5800,  productionDate: "2024-10-19", machine: "Dryer Cylinder DC-4"   },
    { _id: "p10", batchId: "BATCH-2024-010", paperType: "A4 Bond",      quantity: 14300, productionDate: "2024-10-21", machine: "Fourdrinier Wire PM-1" },
];

export const MOCK_QUALITY = [
    { _id: "q1", batchId: "BATCH-2024-001", grammage: 80,  moisture: 5.2,  brightness: 88, qualityStatus: "PASS",    inspectedAt: "2024-10-01" },
    { _id: "q2", batchId: "BATCH-2024-002", grammage: 45,  moisture: 6.8,  brightness: 72, qualityStatus: "WARNING", inspectedAt: "2024-10-03" },
    { _id: "q3", batchId: "BATCH-2024-003", grammage: 120, moisture: 4.9,  brightness: 82, qualityStatus: "PASS",    inspectedAt: "2024-10-05" },
    { _id: "q4", batchId: "BATCH-2024-004", grammage: 18,  moisture: 8.3,  brightness: 65, qualityStatus: "FAIL",    inspectedAt: "2024-10-07" },
    { _id: "q5", batchId: "BATCH-2024-005", grammage: 80,  moisture: 5.5,  brightness: 89, qualityStatus: "PASS",    inspectedAt: "2024-10-10" },
    { _id: "q6", batchId: "BATCH-2024-006", grammage: 115, moisture: 4.7,  brightness: 91, qualityStatus: "PASS",    inspectedAt: "2024-10-12" },
    { _id: "q7", batchId: "BATCH-2024-007", grammage: 45,  moisture: 7.1,  brightness: 70, qualityStatus: "WARNING", inspectedAt: "2024-10-15" },
    { _id: "q8", batchId: "BATCH-2024-008", grammage: 120, moisture: 5.0,  brightness: 83, qualityStatus: "PASS",    inspectedAt: "2024-10-17" },
    { _id: "q9", batchId: "BATCH-2024-009", grammage: 18,  moisture: 9.1,  brightness: 60, qualityStatus: "FAIL",    inspectedAt: "2024-10-19" },
    { _id: "q10", batchId: "BATCH-2024-010", grammage: 80, moisture: 5.1,  brightness: 87, qualityStatus: "PASS",   inspectedAt: "2024-10-21" },
];

export const MOCK_PULP = [
    { _id: "pu1", batchId: "PULP-2024-001", temperature: 68, pressure: 4.2, moisture: 52, ph: 7.1, flowRate: 320, status: "Normal",   recordedAt: "2024-10-01" },
    { _id: "pu2", batchId: "PULP-2024-002", temperature: 72, pressure: 4.8, moisture: 55, ph: 6.9, flowRate: 295, status: "Normal",   recordedAt: "2024-10-03" },
    { _id: "pu3", batchId: "PULP-2024-003", temperature: 88, pressure: 5.9, moisture: 48, ph: 6.3, flowRate: 280, status: "Warning",  recordedAt: "2024-10-05" },
    { _id: "pu4", batchId: "PULP-2024-004", temperature: 65, pressure: 3.8, moisture: 58, ph: 7.4, flowRate: 340, status: "Normal",   recordedAt: "2024-10-07" },
    { _id: "pu5", batchId: "PULP-2024-005", temperature: 95, pressure: 6.5, moisture: 44, ph: 5.8, flowRate: 260, status: "Critical", recordedAt: "2024-10-10" },
    { _id: "pu6", batchId: "PULP-2024-006", temperature: 70, pressure: 4.5, moisture: 53, ph: 7.0, flowRate: 315, status: "Normal",   recordedAt: "2024-10-12" },
    { _id: "pu7", batchId: "PULP-2024-007", temperature: 74, pressure: 4.9, moisture: 50, ph: 6.8, flowRate: 305, status: "Normal",   recordedAt: "2024-10-15" },
    { _id: "pu8", batchId: "PULP-2024-008", temperature: 69, pressure: 4.3, moisture: 54, ph: 7.2, flowRate: 325, status: "Normal",   recordedAt: "2024-10-17" },
];

export const MOCK_MAINTENANCE = [
    { _id: "mt1", maintenanceType: "Preventive", machine: { _id: "m1", machineName: "Fourdrinier Wire PM-1", productionLine: "Line A" }, description: "Monthly bearing inspection & lubrication", priority: "Medium",  status: "Scheduled",   scheduledDate: "2024-10-25", technician: "Rajesh Kumar"   },
    { _id: "mt2", maintenanceType: "Corrective", machine: { _id: "m5", machineName: "Calender Stack CS-5",   productionLine: "Line C" }, description: "Replace worn calender roll covers",         priority: "High",    status: "In Progress", scheduledDate: "2024-10-22", technician: "Suresh Babu"    },
    { _id: "mt3", maintenanceType: "Predictive", machine: { _id: "m4", machineName: "Dryer Cylinder DC-4",   productionLine: "Line B" }, description: "Thermal imaging — dryer section check",     priority: "Low",     status: "Scheduled",   scheduledDate: "2024-10-28", technician: "Anand Sharma"   },
    { _id: "mt4", maintenanceType: "Corrective", machine: { _id: "m7", machineName: "Chip Conveyor CC-7",    productionLine: "Line A" }, description: "Belt drive replacement & alignment",         priority: "Critical", status: "Overdue",    scheduledDate: "2024-10-18", technician: "Priya Nair"     },
    { _id: "mt5", maintenanceType: "Preventive", machine: { _id: "m2", machineName: "Kraft Pulper KP-2",     productionLine: "Line A" }, description: "Quarterly rotor blade sharpening",          priority: "Medium",  status: "Completed",   scheduledDate: "2024-10-15", technician: "Karthik Rajan"  },
    { _id: "mt6", maintenanceType: "Preventive", machine: { _id: "m6", machineName: "Winder Rewinder WR-6",  productionLine: "Line C" }, description: "Core chuck & rider roll inspection",         priority: "Low",     status: "Scheduled",   scheduledDate: "2024-11-02", technician: "Manohar Singh"  },
];

export const MOCK_ALERTS = {
    totalAlerts: 5,
    criticalAlerts: 2,
    warningAlerts: 3,
    alerts: [
        { _id: "a1", type: "Temperature", severity: "Critical", title: "High Machine Temperature",      message: "Dryer Cylinder DC-4 temperature is 95°C — exceeds safe threshold",       machine: "Dryer Cylinder DC-4",   createdAt: "2024-10-22T08:15:00Z" },
        { _id: "a2", type: "Maintenance", severity: "Critical", title: "Overdue Maintenance Order",     message: "Chip Conveyor CC-7 belt replacement overdue by 4 days",                  machine: "Chip Conveyor CC-7",    createdAt: "2024-10-22T07:30:00Z" },
        { _id: "a3", type: "Utilization", severity: "Warning",  title: "Low Machine Utilization",       message: "Press Section PS-3 utilization dropped to 0% — machine is idle",         machine: "Press Section PS-3",    createdAt: "2024-10-22T06:45:00Z" },
        { _id: "a4", type: "Quality",     severity: "Warning",  title: "Quality Below Threshold",       message: "BATCH-2024-009 moisture content at 9.1% exceeds 8% limit",               machine: "Dryer Cylinder DC-4",   createdAt: "2024-10-21T22:10:00Z" },
        { _id: "a5", type: "Process",     severity: "Warning",  title: "Pulp pH Out of Spec",           message: "PULP-2024-005 pH reading of 5.8 is below acceptable range (6.5–7.5)",   machine: "Kraft Pulper KP-2",     createdAt: "2024-10-21T18:00:00Z" },
    ]
};
