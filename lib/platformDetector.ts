export function detectPlatform(payload: any): string {
  // HDPhotoHub detection
  if (payload?.AppointmentId && payload?.AppointmentDate) {
    return 'hdphotohub'
  }

  // Aryeo detection
  if (payload?.order?.id && payload?.order?.items) {
    return 'aryeo'
  }

  // Spiro detection
  if (payload?.job && payload?.job?.status) {
    return 'spiro'
  }

  // RelaHQ detection
  if (payload?.agent && payload?.agent?.fullName) {
    return 'relahq'
  }

  // Tonomo detection
  if (payload?.orderStatus && payload?.orderId) {
    return 'tonomo'
  }

  return 'unknown'
}
