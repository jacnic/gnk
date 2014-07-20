<%@ page import="org.gnk.selectintrigue.Plot; org.gnk.resplacetime.Event" %>
<div class="tabbable tabs-left eventScreen">
    <ul class="nav nav-tabs leftUl">
        <li class="active leftMenuList">
            <a href="#newEvent" data-toggle="tab" class="addEvent">
                <g:message code="redactintrigue.event.addEvent" default="New event"/>
            </a>
        </li>
        <g:each in="${plotInstance.events.sort{it.timing}}" status="i5" var="event">
            <li class="leftMenuList">
                <a href="#event_${event.id}" data-toggle="tab">
                    ${event.timing}% - ${event.name.encodeAsHTML()}
                </a>
                <button data-toggle="confirmation-popout" data-placement="left" class="btn btn-danger" title="Supprimer l'évènement?"
                        data-url="<g:createLink controller="Event" action="Delete" id="${event.id}"/>" data-object="event" data-id="${event.id}">
                    <i class="icon-remove pull-right"></i>
                </button>
            </li>
        </g:each>
    </ul>
    <div class="tab-content">
        <div class="tab-pane active" id="newEvent">
            <form name="newEventForm" data-url="<g:createLink controller="Event" action="Save"/>">
                <g:hiddenField name="eventDescription" class="descriptionContent" value=""/>
                <g:hiddenField name="eventName" class="titleContent" value=""/>
                <input type="hidden" name="plotId" id="plotId" value="${plotInstance?.id}"/>
                <div class="row formRow text-center">
                    <label for="eventName">
                        <g:message code="redactintrigue.event.eventName" default="Name"/>
                    </label>
                </div>

                <div class="fullScreenEditable">
                    <g:render template="dropdownButtons" />

                    <!-- Editor -->
                    <div id="eventTitleRichTextEditor" contenteditable="true" class="text-left richTextEditor textTitle" onblur="saveCarretPos($(this).attr('id'))">
                    </div>
                </div>
                %{--<div class="row formRow">--}%
                    %{--<div class="span1">--}%
                        %{--<label for="eventName">--}%
                            %{--<g:message code="redactintrigue.event.eventName" default="Name"/>--}%
                        %{--</label>--}%
                    %{--</div>--}%

                    %{--<div class="span8">--}%
                        %{--<g:textField name="eventName" id="eventName" value="" required=""/>--}%
                    %{--</div>--}%
                %{--</div>--}%
                <div class="row formRow">
                    <div class="span1">
                        <label for="eventPublic">
                            <g:message code="redactintrigue.event.eventPublic" default="Public"/>
                        </label>
                    </div>

                    <div class="span4">
                        <g:checkBox name="eventPublic" id="eventPublic"/>
                    </div>

                    <div class="span1">
                        <label for="eventPlanned">
                            <g:message code="redactintrigue.event.eventPlanned" default="Planned"/>
                        </label>
                    </div>

                    <div class="span4">
                        <g:checkBox name="eventPlanned" id="eventPlanned"/>
                    </div>
                </div>
                <div class="row formRow">
                    <div class="span1">
                        <label for="eventDuration">
                            <g:message code="redactintrigue.event.eventDuration" default="Duration (min)"/>
                        </label>
                    </div>

                    <div class="span4">
                        <g:field type="number" name="eventDuration" id="eventDuration" value="" required=""/>
                    </div>

                    <div class="span1">
                        <label for="eventTiming">
                            <g:message code="redactintrigue.event.eventTiming" default="Timing (%)"/>
                        </label>
                    </div>

                    <div class="span4">
                        <g:field type="number" name="eventTiming" id="eventTiming" value="" required=""/>
                    </div>
                </div>
                <div class="row formRow">
                    <div class="span1">
                        <label for="eventPlace">
                            <g:message code="redactintrigue.event.eventPlace" default="Place"/>
                        </label>
                    </div>

                    <div class="span4">
                        <g:select name="eventPlace" id="eventPlace" from="${plotInstance.genericPlaces}"
                                  optionKey="id" required="" optionValue="code" noSelection="${['null':'']}"/>
                    </div>

                    <div class="span1">
                        <label for="eventPredecessor">
                            <g:message code="redactintrigue.event.eventPredecessor" default="Predecessor"/>
                        </label>
                    </div>

                    <div class="span4">
                        <g:select name="eventPredecessor" id="eventPredecessor" from="${plotInstance.events}"
                                  optionKey="id"  required="" optionValue="name" noSelection="${['null':'']}"/>
                    </div>
                </div>

                <div class="row formRow text-center">
                    <label for="eventDescription">
                        <g:message code="redactintrigue.event.eventDescription" default="Description"/>
                    </label>
                </div>

                <div class="fullScreenEditable">
                    <g:render template="dropdownButtons" />

                    <!-- Editor -->
                    <div id="eventRichTextEditor" contenteditable="true" class="text-left richTextEditor" onblur="saveCarretPos($(this).attr('id'))">
                    </div>
                </div>
                <input type="button" name="Insert" value="Insert" class="btn btn-primary insertEvent"/>
            </form>
        </div>

    <g:each in="${plotInstance.events}" status="i4" var="event">
        <div class="tab-pane" id="event_${event.id}">
            <form name="updateEvent_${event.id}" data-url="<g:createLink controller="Event" action="Update" id="${event.id}"/>">
                <g:hiddenField name="id" value="${event.id}"/>
                <g:hiddenField name="eventDescription" class="descriptionContent" value=""/>
                <g:hiddenField name="eventName" class="titleContent" value=""/>
                <input type="hidden" name="plotId" id="plotId" value="${plotInstance?.id}"/>
                <div class="row formRow text-center">
                    <label for="eventName">
                        <g:message code="redactintrigue.event.eventName" default="Name"/>
                    </label>
                </div>

                <div class="fullScreenEditable">
                    <g:render template="dropdownButtons" />

                    <!-- Editor -->
                    <div id="eventTitleRichTextEditor${event.id}" contenteditable="true" class="text-left richTextEditor textTitle" onblur="saveCarretPos($(this).attr('id'))">
                        ${event.name.encodeAsHTML()}
                    </div>
                </div>
                %{--<div class="row formRow">--}%
                    %{--<div class="span1">--}%
                        %{--<label for="EventName">--}%
                            %{--<g:message code="redactintrigue.event.eventName" default="Name"/>--}%
                        %{--</label>--}%
                    %{--</div>--}%

                    %{--<div class="span8">--}%
                        %{--<g:textField name="eventName" id="EventName" value="${event.name}" required=""/>--}%
                    %{--</div>--}%
                %{--</div>--}%
                <div class="row formRow">
                    <div class="span1">
                        <label for="eventPublic">
                            <g:message code="redactintrigue.event.eventPublic" default="Public"/>
                        </label>
                    </div>

                    <div class="span4">
                        <g:checkBox name="eventPublic" id="eventPublic" value="${event.isPublic}"/>
                    </div>

                    <div class="span1">
                        <label for="eventPlanned">
                            <g:message code="redactintrigue.event.eventPlanned" default="Planned"/>
                        </label>
                    </div>

                    <div class="span4">
                        <g:checkBox name="eventPlanned" id="eventPlanned" value="${event.isPlanned}"/>
                    </div>
                </div>
                <div class="row formRow">
                    <div class="span1">
                        <label for="EventDuration">
                            <g:message code="redactintrigue.event.eventDuration" default="Duration (min)"/>
                        </label>
                    </div>

                    <div class="span4">
                        <g:field type="number" name="eventDuration" id="EventDuration" value="${event.duration}" required=""/>
                    </div>

                    <div class="span1">
                        <label for="EventTiming">
                            <g:message code="redactintrigue.event.eventTiming" default="Timing (%)"/>
                        </label>
                    </div>

                    <div class="span4">
                        <g:field type="number" name="eventTiming" id="EventTiming" value="${event.timing}" required=""/>
                    </div>
                </div>
                <div class="row formRow">
                    <div class="span1">
                        <label for="eventPlace">
                            <g:message code="redactintrigue.event.eventPlace" default="Place"/>
                        </label>
                    </div>

                    <div class="span4">
                        <g:select name="eventPlace" id="eventPlace" from="${plotInstance.genericPlaces}" value="${event.genericPlace?.id}"
                                  optionKey="id" required="" optionValue="code" noSelection="${['null':'']}"/>
                    </div>

                    <div class="span1">
                        <label for="eventPredecessor">
                            <g:message code="redactintrigue.event.eventPredecessor" default="Predecessor"/>
                        </label>
                    </div>

                    <div class="span4">
                        <g:select name="eventPredecessor" id="eventPredecessor" from="${plotInstance.events}" value="${event.eventPredecessor?.id}"
                                  optionKey="id"  required="" optionValue="name" noSelection="${['null':'']}"/>
                    </div>
                </div>

                <div class="row formRow text-center">
                    <label for="eventDescription">
                        <g:message code="redactintrigue.event.eventDescription" default="Description"/>
                    </label>
                </div>

                <div class="fullScreenEditable">
                    <g:render template="dropdownButtons" />

                    <!-- Editor -->
                    <div id="eventRichTextEditor${event.id}" contenteditable="true" class="text-left richTextEditor" onblur="saveCarretPos($(this).attr('id'))">
                        ${event.description.encodeAsHTML()}
                    </div>
                </div>
                <input type="button" name="Update" data-id="${event.id}" value="Update" class="btn btn-primary updateEvent"/>
            </form>
        </div>
    </g:each>

    </div>
</div>