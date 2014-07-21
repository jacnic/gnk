package org.gnk.user

import org.codehaus.groovy.grails.web.servlet.mvc.GrailsParameterMap
import org.springframework.security.access.annotation.Secured

import javax.servlet.http.Cookie

@Secured(['ROLE_USER', 'ROLE_ADMIN'])
class UserController {
    UserService userService

    def index() {
        render 'Secure access only'
    }

    def profil(){
        User user = session.getAttribute("user")

        if (!user){
            params.setProperty("redirectaction", "profil")
            params.setProperty("redirectcontroller", "user")
            redirect(controller: "adminUser", action: "checkcookie", params: [actionredirect : "profil", controllerredirect : "user"])
            return false
        } else {
        User currentuser = User.findById(user.id)
        int rightuser = currentuser.gright

        List<Boolean> lb = userService.instperm(rightuser)
        [currentuser : currentuser , lb : lb]
        }
    }

    def modifperm(){
        User user = session.getAttribute("user")

        if (!user){
            params.setProperty("redirectaction", "profil")
            params.setProperty("redirectcontroller", "user")
            redirect(controller: "adminUser", action: "checkcookie", params: [actionredirect : "profil", controllerredirect : "user"])
            return false
        } else {
        List<Boolean> lb = []
        user = session.getAttribute('user')
        User currentuser = User.findById(user.id)

        for (int i = 0; i < 24; i++)
        {
            StringBuilder s = new StringBuilder()
            s.append("checkbox")
            s.append(i)
            String checkb = s.toString()
            GrailsParameterMap param = getParams()
            if (param.get(checkb) != null)
            {
                lb.add(true)
            } else {
                lb.add(false)
            }
        }
        currentuser.gright = userService.changeright(lb)
        user.gright = userService.changeright(lb)
        currentuser.save(failOnError: true)
        session.setAttribute("user", user)
        redirect(controller: "user", action: "profil")
        }
    }

    def modifyProfil(){
        User user = session.getAttribute("user")
        User currentuser = User.findById(user.id)
        String newpassword = params.passwordChanged
        String confirmpassword = params.passwordChangedConfirm
        print params
        if (newpassword && newpassword.size() > 3 &&  confirmpassword && confirmpassword.equals(newpassword))
            currentuser.password = newpassword
        if (params.firstnamemodif && params.firstnamemodif != currentuser.firstname){
            currentuser.firstname = params.firstnamemodif
        }
        if (params.lastnamemodif && params.lastnamemodif != currentuser.lastname){
            currentuser.lastname = params.lastnamemodif

        }
        if (params.usernamemodif && params.usernamemodif != currentuser.username){
            if (User.findByUsername((String)params.usernamemodif) == null){
                currentuser.username = params.usernamemodif;
            }
        }
        currentuser.save()
        redirect( action: "profil")
    }
}
