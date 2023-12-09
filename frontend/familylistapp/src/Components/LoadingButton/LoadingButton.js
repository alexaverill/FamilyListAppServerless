
import { Button, Spinner } from 'react-bootstrap'
export default function LoadingButton(props) {
    if(props.isloading){
    return (
        <>
            <Button {...props} disabled>
                <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                />
            </Button>
        </>
    )
    }
    return (
        (
            <>
                <Button {...props} variant="primary">
                </Button>
            </>
        )
    )
}