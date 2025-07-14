import Image from 'next/image'
import Link from 'next/link'
import styles from './footer.module.css'

export default function Footer() {
  const footerLinks = ['About', 'Contact', 'Privacy', 'Terms', 'Help']

  return (
    <footer className={styles.footer}>
      <div className={styles.left}>
        <Link href="/">
          <Image src="/appLogoFooter.png" alt="Logo" width={100} height={50} />
        </Link>
      </div>

      <div className={styles.links}>
        {footerLinks.map((item) => (
          <Link key={item} href={`/${item.toLowerCase()}`} className={styles.link}>
            {item}
          </Link>
        ))}
      </div>
    </footer>
  )
}
