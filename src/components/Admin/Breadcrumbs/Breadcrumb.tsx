'use client'

import React, { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

type TBreadCrumbProps = {
    separator: ReactNode,
    containerClasses?: string,
    listClasses?: string,
    activeClasses?: string,
    capitalizeLinks?: boolean
}

const NextBreadcrumb = ({ separator, containerClasses, listClasses, activeClasses, capitalizeLinks }: TBreadCrumbProps) => {
    const paths = usePathname();
    const pathNames = paths!.split('/').filter(path => path)

    return (
        <div>
            <ul className={containerClasses}>
                {pathNames.map((link, index) => {
                    // Dynamically build the correct path without hardcoding
                    const href = `/${pathNames.slice(0, index + 1).join('/')}`
                    const isActive = paths === href
                    const itemClasses = isActive
                        ? `${listClasses} ${activeClasses} text-blue-500` // Add the active color class
                        : listClasses
                    const itemLink = capitalizeLinks
                        ? link[0].toUpperCase() + link.slice(1)
                        : link

                    return (
                        <React.Fragment key={index}>
                            <li className={itemClasses}>
                                <Link href={href}>{itemLink}</Link>
                            </li>
                            {pathNames.length !== index + 1 && separator}
                        </React.Fragment>
                    )
                })}
            </ul>
        </div>
    )
}

export default NextBreadcrumb
