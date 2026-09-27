export function isOpportunityExpired(
    deadline: string
  ): boolean {
    if (!deadline) return false
  
    const today = new Date()
    today.setHours(0, 0, 0, 0)
  
    const deadlineDate = new Date(
      `${deadline}T23:59:59`
    )
  
    return deadlineDate < today
  }
  
  export function getOpportunityStatus(
    deadline: string
  ): "active" | "archived" {
    return isOpportunityExpired(deadline)
      ? "archived"
      : "active"
  }