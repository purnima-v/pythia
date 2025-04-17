'use client'
import React from 'react'
import { usePathname } from 'next/navigation'
import Link, { LinkProps } from 'next/link'

type ActiveLinkProps = LinkProps & {
  className?: string
  activeClassName: string
  regex?: string
  exact?: boolean
}

export const ActiveLink: React.FC<React.PropsWithChildren<ActiveLinkProps>> = (props) => {
  const { children, className = '', activeClassName, regex, exact = false, ...rest } = props
  const pathname = usePathname()

  const isActive = React.useMemo(() => {
    // Get the link path (works for both SSR and CSR)
    const linkPath = typeof rest.href === 'string' ? rest.href : rest.href.pathname || ''
    const normalizedLinkPath = linkPath.replace(/\/$/, '') // Remove trailing slash

    // Get current path (already normalized by Next.js)
    const currentPath = pathname || '/'

    // Handle root path specially
    if (normalizedLinkPath === '') {
      return currentPath === '/'
    }

    // Use regex if provided
    if (regex) {
      return new RegExp(regex).test(currentPath)
    }

    // Use exact matching if specified
    if (exact) {
      return currentPath === normalizedLinkPath
    }

    // Default: check if current path starts with link path
    return currentPath.startsWith(normalizedLinkPath)
  }, [pathname, rest.href, regex, exact])

  const computedClassName = isActive 
    ? `${className} ${activeClassName}`.trim() 
    : className

  return (
    <Link className={computedClassName} {...rest}>
      {children}
    </Link>
  )
}