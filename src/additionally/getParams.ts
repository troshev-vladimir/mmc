export default function getParams(logo: string) {
  switch (logo) {
    case 'Honda':
      return 'Honda-Acura'
    case 'Acura':
      return 'Honda-Acura'
    case 'Nissan':
      return 'Nissan-Infiniti-Renault'
    case 'Infiniti':
      return 'Nissan-Infiniti-Renault'
    case 'Renault':
      return 'Nissan-Infiniti-Renault'
    case 'Toyota':
      return 'Toyota-Lexus'
    case 'Lexus':
      return 'Toyota-Lexus'
    case 'Ford':
      return 'Ford-Mazda'
    case 'Mazda':
      return 'Ford-Mazda'
    case 'Volkswagen':
      return 'Volkswagen_AG'
    default:
      return logo
  }
}
