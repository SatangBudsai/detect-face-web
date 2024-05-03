import { Fragment, ReactElement } from 'react'
import RootLayout from '@/layouts/root-layout';
import MainLayout from '@/layouts/main-layout';
type Props = {}

const ExamplePrivate = (props: Props) => {

    return (
        <Fragment>
            <div className='flex flex-col gap-5'>
                <div className='flex flex-wrap justify-center items-center gap-5'>
                    Tempalte NextJs and NextUI
                </div>
            </div>
        </Fragment >
    )
}

ExamplePrivate.getLayout = (page: ReactElement) => {
    return (
        <Fragment>
            <RootLayout>
                <MainLayout>
                    {page}
                </MainLayout>
            </RootLayout>
        </Fragment>
    );
};

ExamplePrivate.authGuard = true
export default ExamplePrivate
