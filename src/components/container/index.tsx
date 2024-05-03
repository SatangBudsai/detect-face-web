import { cn } from '@nextui-org/react'
import React, { ReactNode } from 'react'

type Props = {
    children?: ReactNode
    isBackground?: boolean
    heightScreen?: boolean
    className?: string
}

const Container = (props: Props) => {
    const { children, className, isBackground = false, heightScreen = false } = props

    return (
        <section className={cn(isBackground && "bg-glass", heightScreen && "flex flex-col justify-center min-h-[100dvh]")}>
            <div className='flex justify-center'>
                <div className={cn('w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl max-xl:px-5', className)}>
                    {children}
                </div>
            </div>
        </section>
    )
}

export default Container